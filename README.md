# ProfDNA

Базовый монорепозиторий для командной разработки продукта ProfDNA.

## Что входит
- `backend/` — FastAPI + SQLAlchemy + Alembic
- `frontend/` — Next.js заглушка для параллельной фронтенд-разработки
- `docs/` — архитектура и API-контракты
- `seed/` — демо-данные
- `scripts/` — локальные сценарии запуска

## Быстрый старт
```bash
cp .env.example .env
docker compose up --build
```

После запуска:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Healthcheck: `http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

## Минимальный workflow для команды
- `feature/lead-architecture` — каркас, БД, docker, документация
- остальные разработчики работают по доменам и не меняют общую инфраструктуру без согласования
- интеграция идёт через `dev`

## Структура
```text
profdna/
├── backend/
├── frontend/
├── docs/
├── seed/
├── scripts/
├── .env.example
├── docker-compose.yml
└── README.md
```

## Основные сущности
- `users`
- `tests`
- `questions`
- `test_links`
- `sessions`
- `answers`
- `metrics`
- `report_templates`

## Важные команды
```bash
# backend migration inside container
docker compose exec backend alembic revision --autogenerate -m "message"
docker compose exec backend alembic upgrade head

# tests
docker compose exec backend pytest
```

## Правила интеграции
1. Общие контракты меняются только через `docs/api-contract.md`.
2. Общие модели и enum-ы выносятся в `backend/app/common`.
3. Подключение к БД и базовые модели — зона тимлида/архитектора.
4. Все доменные ветки регулярно ребейзятся/мерджатся от `dev`.

## Следующий шаг после каркаса
- добавить роутеры по доменам
- реализовать auth
- подключить сиды
- наполнить frontend реальными страницами и API-интеграцией
