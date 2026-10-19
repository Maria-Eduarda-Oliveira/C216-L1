.PHONY: help install run test test-verbose test-unit test-integration lint migrate makemigrations docker-build docker-up docker-down docker-logs docker-clean frontend-install frontend-lint frontend-format frontend-test frontend-build frontend-test-e2e check-all

PYTHON := poetry run python
APP := main.py
COMPOSE := docker compose

help:
	@echo "Comandos disponiveis:"
	@echo "  make install          - instala as dependencias do backend"
	@echo "  make run              - roda a aplicacao localmente"
	@echo "  make test             - roda todos os testes"
	@echo "  make test-verbose     - roda todos os testes com detalhes"
	@echo "  make test-unit        - roda apenas os testes unitarios"
	@echo "  make test-integration - roda apenas os testes de integracao"
	@echo "  make lint             - roda o linter (ruff)"
	@echo "  make migrate          - aplica as migrations do Alembic"
	@echo "  make makemigrations   - gera uma nova migration do Alembic"
	@echo "  make docker-build     - constroi as imagens docker"
	@echo "  make docker-up        - sobe os containers (backend + db)"
	@echo "  make docker-down      - derruba os containers"
	@echo "  make docker-logs      - mostra os logs dos containers"
	@echo "  make docker-clean     - remove containers, imagens e volumes"

install:
	cd backend && poetry install

run:
	cd backend && poetry run uvicorn main:app --reload

test:
	cd backend && poetry run pytest

test-verbose:
	cd backend && poetry run pytest -v

test-unit:
	cd backend && poetry run pytest tests/unit -v

test-integration:
	cd backend && poetry run pytest tests/integration -v

lint:
	cd backend && poetry run ruff check .

migrate:
	cd backend && poetry run alembic upgrade head

makemigrations:
	cd backend && poetry run alembic revision --autogenerate -m "auto"

docker-build:
	$(COMPOSE) build

docker-up:
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down

docker-logs:
	$(COMPOSE) logs -f

docker-clean:
	$(COMPOSE) down -v --rmi all

	frontend-install:
	cd frontend && npm ci

frontend-lint:
	cd frontend && npm run lint

frontend-format:
	cd frontend && npm run format:check

frontend-test:
	cd frontend && npm run test

frontend-build:
	cd frontend && npm run build

frontend-test-e2e:
	cd frontend && npm run test:e2e

check-all: lint test frontend-lint frontend-format frontend-test frontend-build frontend-test-e2e