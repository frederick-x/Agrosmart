import { Link } from "react-router-dom";

export default function ResultCard({ result, onSave, onReset, saving, saved }) {
  const c = result.crop_info;
  return (
    <div>
      <div className="result-hero mb-4">
        <div className="small text-uppercase opacity-75">🌱 Recommended Crop</div>
        <h2 className="my-2">{result.crop.toUpperCase()}</h2>
        <div>Suitability: <strong>{Math.round(result.confidence)}%</strong></div>
        <div className="small mt-2 opacity-90">{result.message}</div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card card-agro p-4">
            <h5 className="fw-bold text-green">Why {result.crop}?</h5>
            <ul className="list-unstyled">
              {result.checks.map((k) => (
                <li key={k.key} className="mb-2">
                  <i className={`bi ${k.ok ? "bi-check-circle-fill check-ok" : "bi-exclamation-circle-fill check-bad"} me-2`}></i>
                  <strong>{k.label}</strong><div className="small text-muted ms-4">{k.detail}</div>
                </li>
              ))}
            </ul>
            <p className="small mb-2">{result.why}</p>
            {result.top_predictions.length > 1 && (
              <div className="small text-muted">Other close matches: {result.top_predictions.slice(1).filter((t) => t.confidence > 0).map((t) => `${t.crop} (${t.confidence}%)`).join(", ") || "none"}</div>
            )}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card card-agro p-4">
            <h5 className="fw-bold text-green">Ideal Conditions</h5>
            <p className="mb-1"><i className="bi bi-thermometer-half me-2"></i><strong>Temperature:</strong> {c.min_temperature}–{c.max_temperature}°C</p>
            <p className="mb-1"><i className="bi bi-cloud-rain me-2"></i><strong>Rainfall:</strong> {c.rainfall}</p>
            <p className="mb-1"><i className="bi bi-layers me-2"></i><strong>Soil:</strong> {c.soil_type}</p>
            <p className="mb-3"><i className="bi bi-droplet me-2"></i><strong>pH:</strong> {c.min_ph}–{c.max_ph}</p>
            <h6 className="fw-bold text-green">Growing Period</h6>
            <p>{c.growing_period}</p>
            <h6 className="fw-bold text-green">Basic Cultivation</h6>
            <p>{c.cultivation_info}</p>
          </div>
        </div>
        <div className="col-12">
          <div className="card card-agro p-4">
            <h5 className="fw-bold text-green">Basic Fertilizer Advice</h5>
            <p className="mb-2">{c.fertilizer_info}</p>
            <p className="mb-2"><strong>Irrigation:</strong> {c.irrigation_info}</p>
            <div className="alert alert-warning small mb-0">
              These are general recommendations, not exact prescriptions. Fertilizer quantities depend on your soil test, variety and local conditions – please consult a local agricultural expert before applying.
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-4">
        {result.recommendation_id && (
          <button className="btn btn-agro" onClick={onSave} disabled={saving || saved}>
            <i className="bi bi-bookmark-heart me-1"></i>{saved ? "Saved ✓" : saving ? "Saving…" : "Save Recommendation"}
          </button>
        )}
        <button className="btn btn-outline-agro" onClick={onReset}><i className="bi bi-arrow-repeat me-1"></i>Try Again</button>
        <Link className="btn btn-outline-agro" to={`/crops/${c.id}`}><i className="bi bi-info-circle me-1"></i>View Crop Details</Link>
        <Link className="btn btn-outline-agro" to="/history"><i className="bi bi-clock-history me-1"></i>View History</Link>
      </div>
      <p className="small text-muted mt-3">{result.disclaimer}</p>
    </div>
  );
}
