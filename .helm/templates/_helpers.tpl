{{- define "tatarlang.image" -}}
{{- $global := .root.Values.global -}}
{{- $built := dig "werf" "images" .name "ref" "" ($global | toYaml | fromYaml) -}}
{{- if $built -}}
{{- $built -}}
{{- else -}}
{{- index $global.images .name -}}
{{- end -}}
{{- end }}
