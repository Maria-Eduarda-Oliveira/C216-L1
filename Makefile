.PHONY: help install run test test-verbose docker-build docker-up docker-down docker-logs docker-clean

PYTHON := poetry run python
APP := main.py
COMPOSE := docker compose

help:
	@echo "Comandos disponiveis:"
	@echo "  make install      - instala as dependencias do backend"
	@echo "  make run          - roda a aplicacao localmente"
	@echo "  make test         - roda os testes"
	@echo "  make test-verbose - roda os testes com detalhes"
	@echo "  make docker-build - constroi as imagens docker"
	@echo "  make docker-up    - sobe os containers (backend + db)"
	@echo "  make docker-down  - derruba os containers"
	@echo "  make docker-logs  - mostra os logs dos containers"
	@echo "  make docker-clean - remove containers, imagens e volumes"

install:
	cd backend && poetry install

run:
	cd backend && $(PYTHON) $(APP)

test:
	cd backend && poetry run pytest

test-verbose:
	cd backend && poetry run pytest -v

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