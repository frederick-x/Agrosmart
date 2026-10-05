import { Link } from "react-router-dom";

export default function DashboardCard({ icon, title, value, text, to }) {
  return (
    <Link to={to} className="text-decoration-none text-reset">
      <div className="card card-agro p-3">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-circle"><i className={`bi ${icon}`}></i></div>
          <div>
            <div className="fw-bold">{title}</div>
            {value !== undefined && <div className="stat">{value}</div>}
            <div className="small text-muted">{text}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
