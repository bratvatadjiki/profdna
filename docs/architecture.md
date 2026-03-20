# Architecture Draft

## Стек
- Backend: FastAPI, SQLAlchemy 2.x, Alembic, Pydantic v2
- DB: PostgreSQL 16
- Frontend: Next.js 14
- Infra: Docker Compose

## Цель каркаса
Дать команде единый entrypoint, структуру модулей и стабильные контракты, чтобы backend и frontend могли работать параллельно.

## Backend domains
- `auth` — авторизация и токены
- `users` — пользователи и роли
- `tests` — тесты и метаданные
- `questions` — вопросы и конфигурации
- `sessions` — прохождение теста
- `answers` — ответы пользователя
- `metrics` — расчёт метрик
- `reports` — шаблоны и сборка отчётов
- `common` — общие схемы, enum, обёртки response
- `core` — конфиг, логирование, исключения, зависимости
- `db` — engine, session, base, registry

## Архитектурный принцип
- Тонкие API-роутеры
- Доменная логика внутри модулей
- Общие зависимости и cross-cutting concerns в `core`
- SQLAlchemy ORM для persistence layer
- API-контракты фиксируются отдельно в `docs/api-contract.md`

## ER-модель
```text
users (1) ───< sessions >─── (1) tests
tests (1) ───< questions
tests (1) ───< test_links
sessions (1) ───< answers >─── (1) questions
tests (1) ───< report_templates
tests (1) ───< metrics
```

## Таблицы
### users
- id
- email
- full_name
- role
- is_active
- created_at

### tests
- id
- slug
- title
- description
- status
- time_limit_sec
- created_by
- created_at

### questions
- id
- test_id
- code
- type
- title
- description
- order_index
- config (JSONB)
- is_required

### test_links
- id
- test_id
- token
- is_active
- expires_at

### sessions
- id
- user_id nullable
- test_id
- test_link_id nullable
- status
- started_at
- completed_at
- score_raw nullable

### answers
- id
- session_id
- question_id
- value (JSONB)
- created_at

### metrics
- id
- test_id
- code
- name
- formula_config (JSONB)

### report_templates
- id
- test_id
- code
- name
- template_config (JSONB)

## Интеграционный процесс
- Тимлид ведёт `feature/lead-architecture`
- Стабилизация общего состояния — в `dev`
- Перед merge обязательны: сборка, миграции, старт контейнеров, healthcheck
