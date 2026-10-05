from flask import Blueprint, request, jsonify
from models import recommendation_model as rec
from services.prediction_service import recommend
from utils.auth import login_required, optional_user
from utils.validators import validate_prediction

bp = Blueprint("recommendations", __name__)


@bp.post("/predict")
def predict():
    """Validates input -> ML model -> crop info. Saves to history if the farmer is logged in."""
    data, errors = validate_prediction(request.get_json(silent=True) or {})
    if errors:
        return jsonify(success=False, message="Please correct the highlighted fields.", errors=errors), 400
    try:
        result = recommend(data)
    except Exception as exc:  # model missing, DB down, etc.
        return jsonify(success=False, message=str(exc)), 500
    uid = optional_user()
    result["recommendation_id"] = rec.create(uid, data, result["crop"], result["confidence"]) if uid else None
    result["saved_to_history"] = uid is not None
    result["success"] = True
    return jsonify(result)


@bp.get("/recommendations")
@login_required
def history(uid):
    saved = request.args.get("saved") == "1"
    return jsonify(success=True, recommendations=rec.list_for_user(uid, saved))


@bp.post("/recommendations")
@login_required
def save(uid):
    """Marks a recommendation (already in history) as 'saved' for the dashboard."""
    rid = (request.get_json(silent=True) or {}).get("recommendation_id")
    if not isinstance(rid, int):
        return jsonify(success=False, message="recommendation_id is required."), 400
    row = rec.mark_saved(rid, uid)
    if not row:
        return jsonify(success=False, message="Recommendation not found."), 404
    return jsonify(success=True, message="Recommendation saved.", recommendation=row)
