NAMESPACE ?= tatarlang
RELEASE ?= tatarlang
CHART ?= helm/tatarlang
PROFILE ?= tatarlang
LOCUST_USERS ?= 200
LOCUST_SPAWN ?= 10
LOCUST_TIME ?= 3m
EXPORTER_IMAGE ?= containersol/locust_exporter:v0.5.2

.PHONY: images vault deploy status metrics-server vpa locust-operator top loadtest loadtest-cluster

images:
	eval $$(minikube -p $(PROFILE) docker-env) && \
	docker build -t tatarlang/backend:dev -f backend/Dockerfile.k8s backend && \
	docker build -t tatarlang/frontend:dev -f frontend/Dockerfile.k8s frontend

vault:
	helm repo add hashicorp https://helm.releases.hashicorp.com --force-update
	helm upgrade --install vault hashicorp/vault -n vault --create-namespace -f ops/vault/values.yaml

deploy:
	@test -n "$$VAULT_ADDR" -a -n "$$VAULT_TOKEN" || { echo "VAULT_ADDR and VAULT_TOKEN are required"; exit 1; }
	@resolved=$$(mktemp) && trap 'rm -f $$resolved' EXIT && \
	vals eval -f $(CHART)/values.yaml > $$resolved && \
	helm upgrade --install $(RELEASE) $(CHART) -n $(NAMESPACE) --create-namespace -f $$resolved --wait --timeout 10m

status:
	kubectl -n $(NAMESPACE) get pods,svc,ingress

metrics-server:
	helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/ --force-update
	helm upgrade --install metrics-server metrics-server/metrics-server -n kube-system \
		--set 'args={--kubelet-insecure-tls}' --wait

vpa:
	helm repo add autoscaler https://kubernetes.github.io/autoscaler --force-update
	helm upgrade --install vpa autoscaler/vertical-pod-autoscaler -n kube-system --wait

top:
	kubectl top pods -n $(NAMESPACE)

locust-operator:
	helm repo add locust-k8s-operator https://abdelrhmanhamouda.github.io/locust-k8s-operator/ --force-update
	helm upgrade --install locust-operator locust-k8s-operator/locust-k8s-operator -n locust-operator --create-namespace \
		--set locustPods.metricsExporter.image=$(EXPORTER_IMAGE) --wait

loadtest:
	@kubectl -n $(NAMESPACE) port-forward svc/api 18000:8000 >/dev/null 2>&1 & pf=$$!; trap 'kill $$pf' EXIT; sleep 3; \
	mkdir -p loadtest/reports && \
	LOCUST_EMAIL=$$(vault kv get -field=email kv/tatarlang/demo) \
	LOCUST_PASSWORD=$$(vault kv get -field=password kv/tatarlang/demo) \
	locust --config loadtest/locust.conf --users $(LOCUST_USERS) --spawn-rate $(LOCUST_SPAWN) --run-time $(LOCUST_TIME)

loadtest-cluster:
	@test -n "$$VAULT_ADDR" -a -n "$$VAULT_TOKEN" || { echo "VAULT_ADDR and VAULT_TOKEN are required"; exit 1; }
	kubectl -n $(NAMESPACE) delete locusttest load-test-v2 --ignore-not-found
	@resolved=$$(mktemp) && trap 'rm -f $$resolved' EXIT && \
	vals eval -f loadtest/chart/values.yaml > $$resolved && \
	helm upgrade --install loadtest loadtest/chart -n $(NAMESPACE) -f $$resolved --reset-values --force-conflicts \
		--set-file locustfile=loadtest/locustfile.py \
		--set test.users=$(LOCUST_USERS) --set test.spawnRate=$(LOCUST_SPAWN) --set test.runTime=$(LOCUST_TIME)
