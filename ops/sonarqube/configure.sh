#!/usr/bin/env bash
set -euo pipefail

SONAR_URL="${SONAR_URL:-http://127.0.0.1:19000}"
PROJECT="${PROJECT:-tatarlang}"
GATE="${GATE:-tatarlang-gate}"
DROP_METRICS="${DROP_METRICS:-new_coverage}"
GATE_CONDITIONS="${GATE_CONDITIONS:-security_rating GT 3
reliability_rating GT 3
new_violations GT 0
new_security_hotspots_reviewed LT 100
new_duplicated_lines_density GT 3}"
VAULT_PATH="${VAULT_PATH:-kv/tatarlang/sonarqube}"

use_vault() { [[ -n "${VAULT_ADDR:-}" && -n "${VAULT_TOKEN:-}" ]]; }

if [[ -z "${SONAR_ADMIN_PASSWORD:-}" ]]; then
    use_vault || { echo "set SONAR_ADMIN_PASSWORD or VAULT_ADDR and VAULT_TOKEN" >&2; exit 1; }
    SONAR_ADMIN_PASSWORD="$(vault kv get -field=admin_password "$VAULT_PATH")"
fi

auth="admin:$SONAR_ADMIN_PASSWORD"
api() { curl -fsS -u "$auth" "$@"; }

api "$SONAR_URL/api/projects/search?projects=$PROJECT" | jq -e '.components | length > 0' >/dev/null \
    || api -X POST "$SONAR_URL/api/projects/create" -d "project=$PROJECT" -d "name=Tatarlang" >/dev/null

api "$SONAR_URL/api/qualitygates/show?name=$GATE" >/dev/null 2>&1 \
    || api -X POST "$SONAR_URL/api/qualitygates/create" -d "name=$GATE" >/dev/null

conditions="$(api "$SONAR_URL/api/qualitygates/show?name=$GATE" | jq -c '.conditions')"
for metric in $DROP_METRICS; do
    id="$(jq -r --arg m "$metric" '.[] | select(.metric == $m) | .id' <<<"$conditions")"
    if [[ -n "$id" ]]; then
        api -X POST "$SONAR_URL/api/qualitygates/delete_condition" -d "id=$id" >/dev/null
    fi
done
while read -r metric op error; do
    [[ -z "$metric" ]] && continue
    jq -e --arg m "$metric" 'any(.[]; .metric == $m)' <<<"$conditions" >/dev/null && continue
    api -X POST "$SONAR_URL/api/qualitygates/create_condition" \
        -d "gateName=$GATE" -d "metric=$metric" -d "op=$op" -d "error=$error" >/dev/null
done <<<"$GATE_CONDITIONS"

api -X POST "$SONAR_URL/api/qualitygates/select" -d "gateName=$GATE" -d "projectKey=$PROJECT" >/dev/null
api -X POST "$SONAR_URL/api/new_code_periods/set" -d "project=$PROJECT" -d "type=PREVIOUS_VERSION" >/dev/null

new_token() {
    api -X POST "$SONAR_URL/api/user_tokens/generate" \
        -d "name=ci-$(date +%s)" -d "type=PROJECT_ANALYSIS_TOKEN" -d "projectKey=$PROJECT" | jq -r .token
}

if use_vault; then
    vault kv get -field=ci_token "$VAULT_PATH" >/dev/null 2>&1 \
        || vault kv patch "$VAULT_PATH" ci_token="$(new_token)" >/dev/null
elif [[ -n "${GITHUB_ENV:-}" ]]; then
    token="$(new_token)"
    echo "::add-mask::$token"
    echo "SONAR_TOKEN=$token" >> "$GITHUB_ENV"
fi

api "$SONAR_URL/api/qualitygates/show?name=$GATE" \
    | jq -r '"quality gate: \(.name)", (.conditions[] | "  \(.metric) \(.op) \(.error)")'
