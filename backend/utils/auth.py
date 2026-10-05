"""JWT helpers: create tokens and protect routes."""
import datetime
from functools import wraps
import jwt
from flask import request, jsonify
from config import Config


def make_token(user_id):
    exp = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
    return jwt.encode({"sub": str(user_id), "exp": exp}, Config.SECRET_KEY, algorithm="HS256")


def optional_user():
    """Returns user id if a valid token is sent, else None."""
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    try:
        return int(jwt.decode(header[7:], Config.SECRET_KEY, algorithms=["HS256"])["sub"])
    except Exception:
        return None


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        uid = optional_user()
        if uid is None:
            return jsonify(success=False, message="Please log in to continue."), 401
        return fn(uid, *args, **kwargs)
    return wrapper
