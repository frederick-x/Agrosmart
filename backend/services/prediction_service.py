"""Business logic between the API route and the ML model."""
from ml.predict import predict_crop, humidity_range
from models import crop_model


def _check(key, label, ok, detail):
    return {"key": key, "label": label, "ok": bool(ok), "detail": detail}


def build_checks(d, crop, key):
    soils = [s.strip() for s in crop["soil_type"].split(",")]
    lo_h, hi_h = humidity_range(key)
    name = crop["crop_name"]
    return [
        _check("soil", "Suitable soil conditions", d["soil_type"] in soils,
               f"You selected {d['soil_type']}; {name} grows best in {crop['soil_type']}."),
        _check("ph", "Suitable pH", crop["min_ph"] <= d["ph"] <= crop["max_ph"],
               f"Your pH is {d['ph']}; ideal is {crop['min_ph']}–{crop['max_ph']}."),
        _check("temperature", "Suitable temperature", crop["min_temperature"] <= d["temperature"] <= crop["max_temperature"],
               f"Your temperature is {d['temperature']}°C; ideal is {crop['min_temperature']}–{crop['max_temperature']}°C."),
        _check("rainfall", "Suitable rainfall", crop["min_rainfall"] <= d["rainfall"] <= crop["max_rainfall"],
               f"Your rainfall is {d['rainfall']} mm; ideal is {crop['rainfall']}."),
        _check("humidity", "Suitable humidity", lo_h <= d["humidity"] <= hi_h,
               f"Your humidity is {d['humidity']}%; typical for {name} is {lo_h:.0f}–{hi_h:.0f}%."),
    ]


def recommend(d):
    """d = validated input. Returns dict with crop, confidence, crop info, checks, explanation."""
    res = predict_crop(d["nitrogen"], d["phosphorus"], d["potassium"], d["temperature"],
                       d["humidity"], d["ph"], d["rainfall"])
    key = res["key"]
    crop = crop_model.get_by_key(key)
    if crop is None:
        raise RuntimeError(f"Crop '{key}' missing in crop_information. Run: python -m database.init_db")
    checks = build_checks(d, crop, key)
    ok = sum(c["ok"] for c in checks)
    conf = res["confidence"]
    strength = "highly suitable" if conf >= 80 else "suitable" if conf >= 50 else "a possible match"
    why = (f"The Random Forest model compared your N, P, K, pH, temperature, humidity and rainfall with patterns "
           f"learned from crop data and found the closest match to {crop['crop_name']}. {ok} of {len(checks)} "
           f"field checks match its ideal range. Soil type and location are checked separately against the "
           f"crop database (the ML dataset does not contain them).")
    return {
        "crop": crop["crop_name"], "confidence": conf,
        "message": f"{crop['crop_name']} is {strength} for the given conditions.",
        "top_predictions": res["top3"], "crop_info": crop, "checks": checks, "why": why,
        "disclaimer": "This is a decision-support tool. Please consult a local agricultural expert before final farming decisions.",
    }
