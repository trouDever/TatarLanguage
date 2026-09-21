{{- define "api.labels" -}}
app.kubernetes.io/name: api
app.kubernetes.io/part-of: tatarlang
{{- end }}

{{- define "api.waitForDb" -}}
- name: wait-for-postgres
  image: postgres:15-alpine
  command: ["sh", "-c", "until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT; do sleep 2; done"]
  envFrom:
    - configMapRef:
        name: {{ .Values.global.configName }}
{{- end }}
