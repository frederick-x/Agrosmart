import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [f, setF] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email.trim() || !f.password) return setError("Please enter your email and password.");
    setLoading(true); setError("");
    try {
      await login(f.email.trim(), f.password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="container"><div className="card card-agro p-4 auth-card">
      <h3 className="fw-bold text-green text-center mb-3">Welcome back</h3>
      {location.state?.registered && <div className="alert alert-success">Registration successful. Please log in.</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} noValidate>
        <label className="form-label fw-semibold">Email</label>
        <input type="email" className="form-control mb-3" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
        <label className="form-label fw-semibold">Password</label>
        <input type="password" className="form-control mb-4" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
        <button className="btn btn-agro w-100" disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
      </form>
      <p className="text-center small mt-3 mb-0">New here? <Link to="/register">Create an account</Link></p>
    </div></div>
  );
}
