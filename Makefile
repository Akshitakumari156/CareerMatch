.PHONY: up down build migrate seed ingest test lint eval logs clean

up:
	docker compose up -d db api

down:
	docker compose down

build:
	docker compose build

migrate:
	docker compose exec api alembic upgrade head

seed:
	docker compose exec api python scripts/seed_jobs.py

ingest:
	docker compose exec api python -m app.ingestion.pipeline --once

test:
	docker compose exec api pytest

lint:
	docker compose exec api ruff check .

eval:
	docker compose exec api python -m eval.run_eval

logs:
	docker compose logs -f

clean:
	docker compose down -v

