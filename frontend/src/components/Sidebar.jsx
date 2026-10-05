import { NavLink } from "react-router-dom";

const links = [
  ["/dashboard", "bi-speedometer2", "Dashboard"],
  ["/recommend", "bi-flower1", "Crop Recommendation"],
  ["/history", "bi-clock-history", "History"],
  ["/crops", "bi-book", "Crop Information"],
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <nav className="nav flex-md-column flex-row flex-nowrap overflow-auto">
        {links.map(([to, icon, label]) => (
          <NavLink key={to} to={to} className="nav-link text-nowrap"><i className={`bi ${icon} me-2`}></i>{label}</NavLink>
        ))}
      </nav>
    </div>
  );
}
