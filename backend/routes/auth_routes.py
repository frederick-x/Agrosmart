from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import user_model
from utils.auth import make_token
from utils.validators import validate_registration

bp = Blueprint("auth", __name__)


@bp.post("/register")
def register():
    data, errors = validate_registration(request.get_json(silent=True) or {})
    if errors:
        return jsonify(success=False, message="Please correct the errors.", errors=errors), 400
    if user_model.get_by_email(data["email"]):
        return jsonify(success=False, message="This email is already registered.",
                       errors={"email": "This email is already registered."}), 409
    user_model.create(data["name"], data["email"], data["phone"],
                      generate_password_hash(data["password"]), data["location"])
    return jsonify(success=True, message="Registration successful. Please log in."), 201


@bp.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    email = str(body.get("email", "")).strip().lower()
    password = str(body.get("password", ""))
    user = user_model.get_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify(success=False, message="Invalid email or password."), 401
    return jsonify(success=True, token=make_token(user["id"]),
                   user={"id": user["id"], "name": user["name"], "email": user["email"],
                         "location": user["location"]})
