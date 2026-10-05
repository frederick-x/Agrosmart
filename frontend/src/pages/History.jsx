import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { fmtDate } from "./Dashboard";

export default function History() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    setRows(null);
    api.recommendations(savedOnly).then((d) => setRows(d.recommendations)).catch((e) => setError(e.message));
  }, [savedOnly]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h3 className="fw-bold text-green mb-0">Recommendation History</h3>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="so" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
          <label className="form-check-label" htmlFor="so">Saved only</label>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!rows && !error && <div className="text-center py-5"><div className="spinner-border text-success"></div></div>}
      {rows && (rows.length === 0 ? (
        <div className="card card-agro p-4 text-center">No recommendations yet. <Link to="/recommend">Try one now</Link>.</div>
      ) : (
        <div className="card card-agro p-3"><div className="table-responsive"><table className="table table-hover align-middle mb-0">
          <thead><tr><th>Date</th><th>Location</th><th>Soil</th><th>N-P-K</th><th>pH</th><th>Temp</th><th>Humidity</th><th>Rain</th><th>Crop</th><th>Confidence</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td>{fmtDate(r.created_at)}</td><td>{r.location}</td><td>{r.soil_type}</td>
              <td>{r.nitrogen}-{r.phosphorus}-{r.potassium}</td><td>{r.ph}</td><td>{r.temperature}°C</td>
              <td>{r.humidity}%</td><td>{r.rainfall} mm</td>
              <td className="fw-bold text-green">{r.recommended_crop} {r.is_saved ? <i className="bi bi-bookmark-heart-fill ms-1"></i> : null}</td>
              <td>{Math.round(r.confidence)}%</td>
            </tr>
          ))}</tbody>
        </table></div></div>
      ))}
    </div>
  );
}
