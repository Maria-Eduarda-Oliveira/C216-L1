.PHONY: help install run-api run-front test test-front lint lint-front e2e migrate up up-build down logs ps clean check-all

help:
	@echo "Comandos disponiveis:"
	@echo "  make install     - instala dependencias do backend e do frontend"
	@echo "  make run-api     - roda a API localmente (precisa do Postgres local)"
	@echo "  make run-front   - roda o frontend em modo desenvolvimento"
	@echo "  make migrate     - aplica as migrations do Alembic"
	@echo "  make test        - testes do backend (pytest)"
	@echo "  make test-front  - testes do frontend (vitest)"
	@echo "  make lint        - lint do backend (ruff)"
	@echo "  make lint-front  - lint e formatacao do frontend (biome)"
	@echo "  make e2e         - testes E2E (playwright)"
	@echo "  make up-build    - sobe db, api e frontend com Docker Compose"
	@echo "  make ps          - mostra o estado dos containers"
	@echo "  make logs        - acompanha os logs dos containers"
	@echo "  make down        - derruba os containers"
	@echo "  make clean       - derruba os containers e apaga o volume do banco"
	@echo "  make check-all   - roda todas as verificacoes locais"

install:
	cd backend && poetry install
	cd frontend && npm ci

run-api:
	cd backend && poetry run uvicorn main:app --reload

run-front:
	cd frontend && npm run dev

migrate:
	cd backend && poetry run alembic upgrade head

test:
	cd backend && poetry run pytest

test-front:
	cd frontend && npm run test

lint:
	cd backend && poetry run ruff check .

lint-front:
	cd frontend && npm run lint && npm run format:check

e2e:
	cd frontend && npm run test:e2e

up-build:
	docker compose up -d --build

up:
	docker compose up -d

ps:
	docker compose ps

logs:
	docker compose logs -f

down:
	docker compose down

clean:
	docker compose down -v

check-all: lint test lint-front test-front