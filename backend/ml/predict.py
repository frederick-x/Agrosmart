"""Loads crop_model.pkl and exposes predict_crop()."""
import os
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_model.pkl")
_bundle = None


def _load():
    global _bundle
    if _bundle is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError("crop_model.pkl not found. Run: python ml/train_model.py")
        _bundle = joblib.load(MODEL_PATH)
    return _bundle


def predict_crop(n, p, k, temperature, humidity, ph, rainfall):
    b = _load()
    X = pd.DataFrame([[n, p, k, temperature, humidity, ph, rainfall]], columns=b["features"])
    proba = b["model"].predict_proba(X)[0]
    order = proba.argsort()[::-1][:3]
    classes = b["model"].classes_
    top3 = [{"crop": str(classes[i]), "confidence": round(float(proba[i]) * 100, 1)} for i in order]
    return {"key": str(classes[order[0]]), "confidence": top3[0]["confidence"], "top3": top3}


def humidity_range(key):
    lo, hi = _load()["humidity_range"][key]
    return lo, hi
