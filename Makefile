DEV_RUN_CONTEXT ?= docker compose exec dev

############################################
# container
############################################
build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down --remove-orphans

clean:
	docker compose down --rmi all --volumes --remove-orphans

ps:
	docker compose ps -a

logs:
	docker compose logs

logs/%:
	docker compose logs $(@F)

restart: down up

rebuild: clean up

############################################
# common
############################################
default: .cdk/install .go/install

pre-push: go/pre-push cdk/pre-push

############################################
# golang
############################################
go/pre-push: go/fmt go/lint go/test

go/test: .go/ut .go/it

go/fmt:
	$(DEV_RUN_CONTEXT) golangci-lint fmt ./...

go/lint:
	$(DEV_RUN_CONTEXT) golangci-lint run ./...

go/tidy:
	$(DEV_RUN_CONTEXT) go mod tidy

gorm/gen:
	$(DEV_RUN_CONTEXT) go run ./cmd/cli/gorm_gen/main.go && \
	git add ./internal/infrastructure/datasource/orm/query && \
	git add ./internal/infrastructure/datasource/orm/entity

.go/install:
	$(DEV_RUN_CONTEXT) go install ./cmd/...

.go/ut:
	$(DEV_RUN_CONTEXT) gotestsum --junitfile report.xml --format testname -- -race -cover -coverprofile=coverage.out -covermode=atomic -short ./internal/...

.go/it:
	$(DEV_RUN_CONTEXT) gotestsum --junitfile report.xml --format testname -- -race -cover -coverprofile=coverage.out -covermode=atomic -run IT ./internal/...

############################################
# cdk
############################################
cdk/pre-push: cdk/fmt cdk/lint cdk/check cdk/test

cdk/fmt:
	cd infrastructure/cdk && \
	pnpm fmt

cdk/lint:
	cd infrastructure/cdk && \
	pnpm lint

cdk/check:
	cd infrastructure/cdk && \
	pnpm check

cdk/test:
	cd infrastructure/cdk && \
	pnpm test

cdk/local/bootstrap:
	cd infrastructure/cdk && \
	AWS_ENDPOINT_URL=http://localhost:4566 \
	AWS_ENDPOINT_URL_S3=http://s3.localhost.localstack.cloud:4566 \
	pnpm cdk --profile local bootstrap aws://000000000000/ap-northeast-1

cdk/local/diff:
	cd infrastructure/cdk && \
	AWS_ENDPOINT_URL=http://localhost:4566 \
	AWS_ENDPOINT_URL_S3=http://s3.localhost.localstack.cloud:4566 \
	pnpm cdk --profile local diff -c env=local --all

cdk/local/deploy:
	cd infrastructure/cdk && \
	AWS_ENDPOINT_URL=http://localhost:4566 \
	AWS_ENDPOINT_URL_S3=http://s3.localhost.localstack.cloud:4566 \
	pnpm cdk --profile local deploy -c env=local --all

.cdk/install:
	cd infrastructure/cdk && \
	pnpm install
