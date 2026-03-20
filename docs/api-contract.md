# API Contract Draft

## Общие правила
- Префикс API: `/api/v1`
- Все ответы JSON
- Ошибки в едином формате
- ID — UUID
- Статусы и типы — через enum

## Response envelope
```json
{
  "success": true,
  "data": {},
  "meta": null,
  "error": null
}
```

## Error response
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "validation_error",
    "message": "Invalid payload",
    "details": {}
  }
}
```

## Test object
```json
{
  "id": "uuid",
  "slug": "analyst-pro",
  "title": "Analyst Pro",
  "description": "Demo test",
  "status": "draft",
  "time_limit_sec": 1800,
  "questions_count": 10,
  "created_at": "2026-03-20T12:00:00Z"
}
```

## Question object
```json
{
  "id": "uuid",
  "test_id": "uuid",
  "code": "Q1",
  "type": "single_choice",
  "title": "Choose one option",
  "description": null,
  "order_index": 1,
  "is_required": true,
  "config": {
    "options": [
      {"value": "a", "label": "Option A"},
      {"value": "b", "label": "Option B"}
    ],
    "ui": {"variant": "radio"},
    "validation": {"min": 1, "max": 1}
  }
}
```

## GET /api/v1/tests/{slug}
Возвращает тест для frontend.

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "analyst-pro",
    "title": "Analyst Pro",
    "description": "Demo test",
    "status": "published",
    "time_limit_sec": 1800,
    "questions": []
  },
  "meta": null,
  "error": null
}
```

## POST /api/v1/sessions
Создание сессии прохождения.

Request:
```json
{
  "test_id": "uuid",
  "test_link_token": "optional-token",
  "user_id": "optional-uuid"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "in_progress",
    "started_at": "2026-03-20T12:00:00Z"
  },
  "meta": null,
  "error": null
}
```

## POST /api/v1/answers
```json
{
  "session_id": "uuid",
  "question_id": "uuid",
  "value": {"selected": ["a"]}
}
```

## GET /api/v1/sessions/{id}/result
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "status": "completed",
    "metrics": [
      {"code": "logic", "value": 0.81, "label": "Logic"}
    ],
    "score_raw": 81.0
  },
  "meta": null,
  "error": null
}
```

## GET /api/v1/sessions/{id}/report
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "report_template": "basic-v1",
    "summary": "Draft report summary",
    "blocks": []
  },
  "meta": null,
  "error": null
}
```
