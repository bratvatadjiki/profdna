def normalize_score(raw: float, min_score: float = 0.0, max_score: float = 10.0) -> float:
    if max_score <= min_score:
        return 0.0

    value = (raw - min_score) / (max_score - min_score) * 100
    if value < 0:
        value = 0.0
    if value > 100:
        value = 100.0

    return round(value, 2)


def interpret_score(normalized: float) -> str:
    if normalized < 35:
        return "Низкая выраженность"
    if normalized < 70:
        return "Средняя выраженность"
    return "Высокая выраженность"


def prettify_scale_title(scale_key: str) -> str:
    return scale_key.replace("_", " ").strip().title()


def build_summary(scales: list[dict]) -> dict:
    if not scales:
        return {
            "total_scales": 0,
            "dominant_scale": None,
            "dominant_score": 0,
        }

    sorted_scales = sorted(
        scales,
        key=lambda item: item["normalized_score"],
        reverse=True,
    )
    top = sorted_scales[0]

    return {
        "total_scales": len(scales),
        "dominant_scale": top["key"],
        "dominant_score": top["normalized_score"],
    }