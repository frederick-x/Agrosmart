import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export const fmtDate = (s) => new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function Dashboard() {
  const { user } = useAuth();
  const [recs, setRecs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api.recommendations().then((d) => setRecs(d.recommendations)).catch((e) => setError(e.message)); }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!recs) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;

  const latest = recs[0];
  const saved = recs.filter((r) => r.is_saved);
  const savedCrops = [...new Set(saved.map((r) => r.recommended_crop))];
  const distinct = new Set(recs.map((r) => r.recommended_crop)).size;

  return (
    <div>
      <div className="card card-agro p-4 mb-4 bg-green-soft">
        <h3 className="fw-bold text-green mb-1">Welcome, {user.name}! 👋</h3>
        <p className="mb-0 text-muted">Let's find the best crop for your farm today.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><DashboardCard to="/recommend" icon="bi-flower1" title="Crop Recommendation" text="Start a new recommendation" /></div>
        <div className="col-sm-6 col-xl-3"><DashboardCard to="/history" icon="bi-droplet-half" title="Soil Analysis" value={latest ? `pH ${latest.ph}` : "–"} text={latest ? `${latest.soil_type} soil (latest)` : "No data yet"} /></div>
        <div className="col-sm-6 col-xl-3"><DashboardCard to="/history" icon="bi-basket" title="Recommended Crops" value={distinct} text={`${recs.length} total recommendations`} /></div>
        <div className="col-sm-6 col-xl-3"><DashboardCard to="/history" icon="bi-clock-history" title="Recommendation History" value={recs.length} text="View all past results" /></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6"><div className="card card-agro p-4">
          <h5 className="fw-bold text-green">Latest Recommendation</h5>
          {latest ? (<>
            <div className="stat">{latest.recommended_crop}</div>
            <div className="text-muted small">{Math.round(latest.confidence)}% confidence · {latest.location} · {fmtDate(latest.created_at)}</div>
          </>) : <p className="text-muted mb-0">No recommendations yet. <Link to="/recommend">Get your first one</Link>.</p>}
        </div></div>
        <div className="col-md-6"><div className="card card-agro p-4">
          <h5 className="fw-bold text-green">Saved Crops</h5>
          {savedCrops.length ? savedCrops.map((c) => <span key={c} className="chip">{c}</span>) : <p className="text-muted mb-0">Nothing saved yet. Use “Save Recommendation” on a result.</p>}
        </div></div>
      </div>

      <div className="card card-agro p-4">
        <div className="d-flex justify-content-between"><h5 className="fw-bold text-green">Recent History</h5><Link to="/history">View all</Link></div>
        {recs.length ? (
          <div className="table-responsive"><table className="table align-middle mb-0">
            <thead><tr><th>Date</th><th>Location</th><th>Crop</th><th>Confidence</th></tr></thead>
            <tbody>{recs.slice(0, 5).map((r) => (
              <tr key={r.id}><td>{fmtDate(r.created_at)}</td><td>{r.location}</td><td>{r.recommended_crop}</td><td>{Math.round(r.confidence)}%</td></tr>
            ))}</tbody>
          </table></div>
        ) : <p className="text-muted mb-0">No history yet.</p>}
      </div>
    </div>
  );
}
