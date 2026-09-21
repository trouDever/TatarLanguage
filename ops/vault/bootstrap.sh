#!/usr/bin/env bash
set -euo pipefail

: "${VAULT_ADDR:?VAULT_ADDR is required}"
: "${VAULT_TOKEN:?VAULT_TOKEN with admin rights is required}"

here="$(cd "$(dirname "$0")" && pwd)"
secret() { openssl rand -hex "${1:-12}"; }
missing() { ! vault kv get "kv/tatarlang/$1" >/dev/null 2>&1; }

vault secrets list -format=json | jq -e '."kv/"' >/dev/null || vault secrets enable -path=kv kv-v2 >/dev/null

missing postgres && vault kv put kv/tatarlang/postgres user=tatarlang password="$(secret)" database=tatarlang >/dev/null
missing rabbitmq && vault kv put kv/tatarlang/rabbitmq user=tatarlang password="$(secret)" >/dev/null
missing demo && vault kv put kv/tatarlang/demo email=student@tatarlang.local password="$(secret 8)" >/dev/null
missing registry && vault kv put kv/tatarlang/registry \
    host="${REGISTRY_HOST:-localhost:5000}" username=tatarlang-ci token="$(secret 16)" insecure="${REGISTRY_INSECURE:-true}" >/dev/null

vault policy write tatarlang-deploy "$here/deploy-policy.hcl" >/dev/null

vault auth list -format=json | jq -e '."approle/"' >/dev/null || vault auth enable approle >/dev/null
vault write auth/approle/role/tatarlang-deploy token_policies=tatarlang-deploy token_ttl=20m token_max_ttl=1h >/dev/null

echo "VAULT_ROLE_ID=$(vault read -field=role_id auth/approle/role/tatarlang-deploy/role-id)"
echo "VAULT_SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/tatarlang-deploy/secret-id)"
