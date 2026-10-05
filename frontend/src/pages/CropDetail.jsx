import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function CropDetail() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api.crop(id).then((d) => setC(d.crop)).catch((e) => setError(e.message)); }, [id]);

  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!c) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;

  const rows = [
    ["bi-layers", "Ideal soil", c.soil_type], ["bi-droplet", "Ideal pH", `${c.min_ph}–${c.max_ph}`],
    ["bi-thermometer-half", "Temperature", `${c.min_temperature}–${c.max_temperature} °C`], ["bi-cloud-rain", "Rainfall", c.rainfall],
    ["bi-hourglass-split", "Growing period", c.growing_period],
  ];
  const blocks = [["Basic cultivation", c.cultivation_info], ["General fertilizer information", c.fertilizer_info], ["Irrigation", c.irrigation_info]];

  return (
    <div className="container py-4">
      <Link to="/crops" className="small"><i className="bi bi-arrow-left"></i> All crops</Link>
      <h2 className="fw-bold text-green mt-2">{c.crop_name}</h2>
      <p className="lead">{c.description}</p>
      <div className="row g-3 mb-3">
        {rows.map(([icon, k, v]) => (
          <div className="col-md-6 col-lg-4" key={k}><div className="card card-agro p-3 d-flex flex-row gap-3 align-items-center">
            <div className="icon-circle"><i className={`bi ${icon}`}></i></div><div><div className="small text-muted">{k}</div><div className="fw-semibold">{v}</div></div></div></div>
        ))}
      </div>
      <div className="row g-3">
        {blocks.map(([k, v]) => (<div className="col-md-4" key={k}><div className="card card-agro p-4"><h6 className="fw-bold text-green">{k}</h6><p className="mb-0">{v}</p></div></div>))}
      </div>
      <div className="alert alert-warning small mt-4">Fertilizer and irrigation notes are general guidance. Please consult a local agricultural expert for exact quantities.</div>
    </div>
  );
}
