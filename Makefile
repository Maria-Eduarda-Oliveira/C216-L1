.PHONY: help install run test

PYTHON := poetry run python
APP := main.py

help:
	@echo "Comandos disponiveis:"
	@echo "  make install  - instala as dependencias do backend"
	@echo "  make run      - roda a aplicacao"
	@echo "  make test     - roda os testes"

install:
	cd backend && poetry install

run:
	cd backend && $(PYTHON) $(APP)

test:
	cd backend && poetry run pytest