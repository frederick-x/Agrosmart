import { useEffect, useState } from "react";
import CropCard from "../components/CropCard";
import { api } from "../services/api";

export default function Crops() {
  const [search, setSearch] = useState("");
  const [crops, setCrops] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      api.crops(search.trim()).then((d) => { setCrops(d.crops); setError(""); }).catch((e) => setError(e.message));
    }, 300); // wait for the user to stop typing
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-green">Crop Information</h2>
      <p className="text-muted">Search crops by name, soil or description.</p>
      <div className="input-group mb-4" style={{ maxWidth: 480 }}>
        <span className="input-group-text"><i className="bi bi-search"></i></span>
        <input className="form-control" placeholder="Search e.g. rice, loamy, banana…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {!crops && !error && <div className="text-center py-5"><div className="spinner-border text-success"></div></div>}
      {crops && !crops.length && <p className="text-muted">No crops found.</p>}
      <div className="row g-4">{crops && crops.map((c) => <div className="col-sm-6 col-lg-4 col-xl-3" key={c.id}><CropCard crop={c} /></div>)}</div>
    </div>
  );
}
