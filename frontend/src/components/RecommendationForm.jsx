import { useState } from "react";

const SOILS = ["Sandy", "Loamy", "Clay", "Silt", "Black Soil", "Red Soil", "Alluvial Soil"];
// [key, label, hint, min, max, step]
const NUMBERS = [
  ["nitrogen", "Nitrogen (N)", "Amount of nitrogen in soil (0–300)", 0, 300, 1],
  ["phosphorus", "Phosphorus (P)", "Amount of phosphorus in soil (0–300)", 0, 300, 1],
  ["potassium", "Potassium (K)", "Amount of potassium in soil (0–300)", 0, 300, 1],
  ["ph", "Soil pH", "0 = very acidic, 7 = neutral, 14 = very alkaline", 0, 14, 0.1],
  ["temperature", "Temperature (°C)", "Average temperature of your area (0–55)", 0, 55, 0.1],
  ["humidity", "Humidity (%)", "Moisture in the air (0–100)", 0, 100, 0.1],
  ["rainfall", "Rainfall (mm)", "Rainfall during the growing season (0–3000)", 0, 3000, 1],
];
const EMPTY = { nitrogen: "", phosphorus: "", potassium: "", ph: "", temperature: "", humidity: "", rainfall: "", soil_type: "", state: "", district: "", village: "" };
const DEMO = { nitrogen: 80, phosphorus: 48, potassium: 40, ph: 6.4, temperature: 24, humidity: 82, rainfall: 236, soil_type: "Loamy", state: "Tamil Nadu", district: "Thanjavur", village: "Kumbakonam" };

export default function RecommendationForm({ onSubmit, loading, serverErrors = {} }) {
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const change = (e) => setV({ ...v, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    NUMBERS.forEach(([k, label, , min, max]) => {
      if (v[k] === "") err[k] = `${label} is required.`;
      else if (Number(v[k]) < min || Number(v[k]) > max) err[k] = `${label} must be between ${min} and ${max}.`;
    });
    if (!v.soil_type) err.soil_type = "Please choose a soil type.";
    if (!v.state.trim()) err.state = "State is required.";
    if (!v.district.trim()) err.district = "District is required.";
    if (!v.village.trim()) err.village = "Village / City is required.";
    return err;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    const payload = { soil_type: v.soil_type, location: [v.village, v.district, v.state].map((s) => s.trim()).join(", ") };
    NUMBERS.forEach(([k]) => (payload[k] = Number(v[k])));
    onSubmit(payload);
  };

  const all = { ...serverErrors, ...errors };
  const err = (k) => all[k] && <div className="invalid-feedback d-block">{all[k]}</div>;

  return (
    <form onSubmit={submit} noValidate className="card card-agro p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="fw-bold text-green mb-0">Enter Your Farm Details</h4>
        <button type="button" className="btn btn-sm btn-outline-agro" onClick={() => { setV(DEMO); setErrors({}); }}>Fill sample values</button>
      </div>

      <h6 className="text-muted"><i className="bi bi-layers me-1"></i>Soil Parameters</h6>
      <div className="row g-3 mb-3">
        {NUMBERS.slice(0, 4).map(([k, label, hint, min, max, step]) => (
          <div className="col-md-6" key={k}>
            <label className="form-label fw-semibold">{label}</label>
            <input type="number" name={k} min={min} max={max} step={step} value={v[k]} onChange={change} className={`form-control ${all[k] ? "is-invalid" : ""}`} />
            <div className="form-text">{hint}</div>{err(k)}
          </div>
        ))}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Soil Type</label>
          <select name="soil_type" value={v.soil_type} onChange={change} className={`form-select ${all.soil_type ? "is-invalid" : ""}`}>
            <option value="">Select soil type</option>
            {SOILS.map((s) => <option key={s}>{s}</option>)}
          </select>{err("soil_type")}
        </div>
      </div>

      <h6 className="text-muted"><i className="bi bi-cloud-sun me-1"></i>Environmental Parameters</h6>
      <div className="row g-3 mb-3">
        {NUMBERS.slice(4).map(([k, label, hint, min, max, step]) => (
          <div className="col-md-4" key={k}>
            <label className="form-label fw-semibold">{label}</label>
            <input type="number" name={k} min={min} max={max} step={step} value={v[k]} onChange={change} className={`form-control ${all[k] ? "is-invalid" : ""}`} />
            <div className="form-text">{hint}</div>{err(k)}
          </div>
        ))}
      </div>

      <h6 className="text-muted"><i className="bi bi-geo-alt me-1"></i>Location</h6>
      <div className="row g-3 mb-4">
        {[["state", "State"], ["district", "District"], ["village", "Village / City"]].map(([k, label]) => (
          <div className="col-md-4" key={k}>
            <label className="form-label fw-semibold">{label}</label>
            <input name={k} value={v[k]} onChange={change} maxLength={60} className={`form-control ${all[k] ? "is-invalid" : ""}`} />{err(k)}
          </div>
        ))}
      </div>
      {all.location && <div className="text-danger small mb-2">{all.location}</div>}

      <button className="btn btn-agro btn-lg" disabled={loading}>
        {loading ? (<><span className="spinner-border spinner-border-sm me-2"></span>Analysing…</>) : "🌱 Recommend Crop"}
      </button>
    </form>
  );
}
