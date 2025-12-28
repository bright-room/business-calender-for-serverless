FROM golangci/golangci-lint:latest AS golangci-lint

FROM migrate/migrate:latest AS migrate

FROM golang:1.25.4 AS builder

ENV GO111MODULE on

RUN go install golang.org/x/tools/cmd/godoc@latest && \
    go install mvdan.cc/gofumpt@latest && \
    go install gotest.tools/gotestsum@latest

RUN apt-get update -y && \
    apt-get install -y clang-format

FROM golang:1.25.4

COPY --from=migrate /usr/local/bin/migrate /usr/local/bin/
COPY --from=golangci-lint /usr/bin/golangci-lint /usr/local/bin/
COPY --from=builder /usr/bin/clang-format /usr/local/bin/
COPY --from=builder /go/bin/godoc /usr/local/bin/
COPY --from=builder /go/bin/gofumpt /usr/local/bin/
COPY --from=builder /go/bin/gotestsum /usr/local/bin/

WORKDIR /workspace

RUN git config --global --add safe.directory /workspace
