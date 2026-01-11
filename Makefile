.PHONY: run build test migrate-up migrate-down migrate-status db-check smoke-notify

run:
	go run ./cmd/server

build:
	go build -o bin/server ./cmd/server

test:
	go test ./...

migrate-up:
	go run ./cmd/migrate up

migrate-down:
	go run ./cmd/migrate down

migrate-status:
	go run ./cmd/migrate status

db-check:
	go run ./cmd/dbcheck

smoke-notify:
	go run ./cmd/smoke_notify
