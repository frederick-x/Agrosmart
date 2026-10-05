import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-agro sticky-top">
      <div className="container">
        <Link className="navbar-brand brand" to="/"><i className="bi bi-flower2 me-1"></i>AgroSmart</Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle menu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item"><NavLink end className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><a className="nav-link" href="/#about">About</a></li>
            <li className="nav-item"><NavLink className="nav-link" to="/recommend">Crop Recommendation</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/crops">Crops</NavLink></li>
            {user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/dashboard"><i className="bi bi-person-circle me-1"></i>{user.name.split(" ")[0]}</NavLink></li>
                <li className="nav-item"><button className="btn btn-outline-agro btn-sm ms-lg-2" onClick={() => { logout(); navigate("/"); }}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><Link className="btn btn-agro btn-sm ms-lg-2" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
