def apply_score_map(acc: dict[str, float], score_map: dict[str, float | int]) -> None:
    for key, value in score_map.items():
        acc[key] = acc.get(key, 0.0) + float(value)