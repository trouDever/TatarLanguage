#!/usr/bin/env bash
set -euo pipefail

: "${VAULT_ADDR:?VAULT_ADDR is required}"
: "${VAULT_TOKEN:?VAULT_TOKEN is required}"

here="$(cd "$(dirname "$0")" && pwd)"
ns=sonarqube
path=kv/tatarlang/sonarqube

if ! vault kv get "$path" >/dev/null 2>&1; then
    vault kv put "$path" \
        admin_password="Sq$(openssl rand -hex 10)!" \
        db_password="$(openssl rand -hex 16)" \
        monitoring_passcode="$(openssl rand -hex 16)" >/dev/null
fi

field() { vault kv get -field="$1" "$path"; }

kubectl create namespace "$ns" --dry-run=client -o yaml | kubectl apply -f -
kubectl -n "$ns" create secret generic sonarqube-db \
    --from-literal=password="$(field db_password)" --dry-run=client -o yaml | kubectl apply -f -
kubectl -n "$ns" create secret generic sonarqube-admin \
    --from-literal=password="$(field admin_password)" --from-literal=currentPassword=admin \
    --dry-run=client -o yaml | kubectl apply -f -
kubectl -n "$ns" create secret generic sonarqube-monitoring \
    --from-literal=passcode="$(field monitoring_passcode)" --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -f "$here/postgres.yaml"
kubectl -n "$ns" rollout status statefulset/sonarqube-db --timeout=180s

helm repo add sonarqube https://SonarSource.github.io/helm-chart-sonarqube --force-update >/dev/null
helm upgrade --install sonarqube sonarqube/sonarqube -n "$ns" -f "$here/values.yaml" --timeout 15m --wait
