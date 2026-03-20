def build_scale_bars(metrics: dict) -> str:
    """
    Генерирует HTML с простыми полосками по шкалам
    """

    scales = metrics.get("scales", {})
    html = ""

    for name, value in scales.items():
        percent = int(value * 100)

        html += f"""
        <div style="margin-bottom: 10px;">
            <div><strong>{name}</strong> — {percent}%</div>
            <div style="background:#eee; width:100%; height:10px;">
                <div style="background:#4CAF50; width:{percent}%; height:10px;"></div>
            </div>
        </div>
        """

    return html