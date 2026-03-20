from typing import Any


def success_response(data: Any, meta: dict | None = None) -> dict:
    return {"success": True, "data": data, "meta": meta, "error": None}


def error_response(code: str, message: str, details: dict | None = None) -> dict:
    return {
        "success": False,
        "data": None,
        "meta": None,
        "error": {"code": code, "message": message, "details": details or {}},
    }
