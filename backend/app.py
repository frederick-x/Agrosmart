"""Flask entry point.  Run:  python app.py"""
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.auth_routes import bp as auth_bp
from routes.crop_routes import bp as crop_bp
from routes.recommendation_routes import bp as reco_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})
    for bp in (auth_bp, crop_bp, reco_bp):
        app.register_blueprint(bp, url_prefix="/api")

    @app.get("/api/health")
    def health():
        return jsonify(success=True, message="AgroSmart API is running")

    @app.errorhandler(404)
    def not_found(_):
        return jsonify(success=False, message="Resource not found."), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify(success=False, message="Internal server error."), 500

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=5000, debug=True)
