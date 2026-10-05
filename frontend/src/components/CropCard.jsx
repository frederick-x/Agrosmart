import { Link } from "react-router-dom";

export default function CropCard({ crop }) {
  return (
    <div className="card card-agro p-3 d-flex flex-column">
      <h5 className="text-green fw-bold"><i className="bi bi-flower1 me-2"></i>{crop.crop_name}</h5>
      <p className="small text-muted flex-grow-1">{crop.description}</p>
      <ul className="list-unstyled small mb-3">
        <li><i className="bi bi-thermometer-half me-1"></i>{crop.min_temperature}–{crop.max_temperature} °C</li>
        <li><i className="bi bi-cloud-rain me-1"></i>{crop.rainfall}</li>
        <li><i className="bi bi-hourglass-split me-1"></i>{crop.growing_period}</li>
      </ul>
      <Link to={`/crops/${crop.id}`} className="btn btn-outline-agro btn-sm">View details</Link>
    </div>
  );
}
