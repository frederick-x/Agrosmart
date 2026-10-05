"""Backend validation. Returns (clean_data, errors_dict)."""
import re

SOIL_TYPES = ["Sandy", "Loamy", "Clay", "Silt", "Black Soil", "Red Soil", "Alluvial Soil"]
# field: (label, min, max)
NUMERIC = {
    "nitrogen": ("Nitrogen", 0, 300),
    "phosphorus": ("Phosphorus", 0, 300),
    "potassium": ("Potassium", 0, 300),
    "ph": ("Soil pH", 0, 14),
    "temperature": ("Temperature", 0, 55),
    "humidity": ("Humidity", 0, 100),
    "rainfall": ("Rainfall", 0, 3000),
}


def validate_prediction(data):
    clean, errors = {}, {}
    for field, (label, lo, hi) in NUMERIC.items():
        raw = data.get(field)
        if raw is None or str(raw).strip() == "":
            errors[field] = f"{label} is required."
            continue
        try:
            val = float(raw)
        except (TypeError, ValueError):
            errors[field] = f"{label} must be a number."
            continue
        if val != val or val in (float("inf"), float("-inf")):
            errors[field] = f"{label} must be a valid number."
        elif val < lo or val > hi:
            errors[field] = f"{label} must be between {lo} and {hi}."
        else:
            clean[field] = val
    soil = str(data.get("soil_type", "")).strip()
    if soil not in SOIL_TYPES:
        errors["soil_type"] = "Please choose a valid soil type."
    else:
        clean["soil_type"] = soil
    loc = str(data.get("location", "")).strip()
    if not loc:
        errors["location"] = "Location is required."
    elif len(loc) > 190:
        errors["location"] = "Location is too long."
    else:
        clean["location"] = loc
    return clean, errors


def validate_registration(data):
    e = {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    phone = str(data.get("phone", "")).strip()
    pw = str(data.get("password", ""))
    loc = str(data.get("location", "")).strip()
    if len(name) < 2 or len(name) > 100:
        e["name"] = "Please enter your full name."
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email) or len(email) > 120:
        e["email"] = "Please enter a valid email address."
    if not re.match(r"^\+?\d{10,15}$", phone):
        e["phone"] = "Phone number must have 10–15 digits."
    if len(pw) < 8:
        e["password"] = "Password must be at least 8 characters."
    if pw != str(data.get("confirm_password", "")):
        e["confirm_password"] = "Passwords do not match."
    if not loc or len(loc) > 150:
        e["location"] = "Please enter your location."
    return {"name": name, "email": email, "phone": phone, "password": pw, "location": loc}, e
