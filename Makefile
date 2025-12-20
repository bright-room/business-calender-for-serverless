default: cdk/install

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

cdk/install:
	cd infrastructure/cdk && \
	pnpm install

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
