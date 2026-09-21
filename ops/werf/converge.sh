#!/usr/bin/env bash
set -euo pipefail

: "${VAULT_ADDR:?VAULT_ADDR is required}"
export VAULT_ADDR

NAMESPACE="${NAMESPACE:-tatarlang}"
RELEASE="${RELEASE:-tatarlang}"
KV_PREFIX="${KV_PREFIX:-kv/tatarlang}"

vault_login() {
    if [[ -n "${VAULT_ROLE_ID:-}" && -n "${VAULT_SECRET_ID:-}" ]]; then
        VAULT_TOKEN="$(vault write -field=token auth/approle/login \
            role_id="$VAULT_ROLE_ID" secret_id="$VAULT_SECRET_ID")"
    fi
    : "${VAULT_TOKEN:?set VAULT_TOKEN or VAULT_ROLE_ID and VAULT_SECRET_ID}"
    export VAULT_TOKEN
    vault token lookup >/dev/null
}

kv_json() {
    vault kv get -format=json "$KV_PREFIX/$1" | jq -c '.data.data'
}

registry_login() {
    local registry
    registry="$(kv_json registry)"
    REGISTRY_HOST="$(jq -r .host <<<"$registry")"
    local user token
    user="$(jq -r .username <<<"$registry")"
    token="$(jq -r .token <<<"$registry")"
    local flags=()
    if [[ "$(jq -r '.insecure // "false"' <<<"$registry")" == "true" ]]; then
        flags+=(--insecure-registry)
        export WERF_INSECURE_REGISTRY=1
    fi
    werf cr login "$REGISTRY_HOST" --username "$user" --password-stdin ${flags[@]+"${flags[@]}"} <<<"$token"
    export WERF_REPO="${WERF_REPO:-$REGISTRY_HOST/tatarlang}"
}

secret_args() {
    jq -n -r \
        --argjson pg "$(kv_json postgres)" \
        --argjson mq "$(kv_json rabbitmq)" \
        --argjson demo "$(kv_json demo)" '
        {
            "secrets.postgresUser": $pg.user,
            "secrets.postgresPassword": $pg.password,
            "secrets.postgresDb": $pg.database,
            "secrets.rabbitUser": $mq.user,
            "secrets.rabbitPassword": $mq.password,
            "secrets.demoEmail": $demo.email,
            "secrets.demoPassword": $demo.password
        } | to_entries[] | "--set-string=\(.key)=\(.value)"'
}

vault_login
registry_login

SECRET_ARGS=()
while IFS= read -r arg; do
    SECRET_ARGS+=("$arg")
done < <(secret_args)

werf converge \
    --release "$RELEASE" \
    --namespace "$NAMESPACE" \
    "${SECRET_ARGS[@]}"
