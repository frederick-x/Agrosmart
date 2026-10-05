from flask import Blueprint, request, jsonify
from models import crop_model

bp = Blueprint("crops", __name__)


@bp.get("/crops")
def crops():
    search = request.args.get("search", "").strip()[:60]
    return jsonify(success=True, crops=crop_model.list_crops(search))


@bp.get("/crops/<int:crop_id>")
def crop_detail(crop_id):
    crop = crop_model.get_crop(crop_id)
    if not crop:
        return jsonify(success=False, message="Crop not found."), 404
    return jsonify(success=True, crop=crop)
