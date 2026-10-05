import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const FIELDS = [
  ["name", "Full Name", "text"], ["email", "Email", "email"], ["phone", "Phone Number", "tel"],
  ["location", "Location (village / district / state)", "text"], ["password", "Password (min 8 characters)", "password"],
  ["confirm_password", "Confirm Password", "password"],
];

export default function Register() {
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm_password: "", location: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Please enter a valid email.";
    if (!/^\+?\d{10,15}$/.test(f.phone)) e.phone = "Phone number must have 10–15 digits.";
    if (!f.location.trim()) e.location = "Please enter your location.";
    if (f.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (f.password !== f.confirm_password) e.confirm_password = "Passwords do not match.";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e); setError("");
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await api.register(f);
      navigate("/login", { state: { registered: true } });
    } catch (err) { setError(err.message); setErrors(err.errors || {}); }
    setLoading(false);
  };

  return (
    <div className="container"><div className="card card-agro p-4 auth-card">
      <h3 className="fw-bold text-green text-center mb-3">Create your account</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} noValidate>
        {FIELDS.map(([k, label, type]) => (
          <div className="mb-3" key={k}>
            <label className="form-label fw-semibold">{label}</label>
            <input type={type} className={`form-control ${errors[k] ? "is-invalid" : ""}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            {errors[k] && <div className="invalid-feedback">{errors[k]}</div>}
          </div>
        ))}
        <button className="btn btn-agro w-100" disabled={loading}>{loading ? "Creating…" : "Register"}</button>
      </form>
      <p className="text-center small mt-3 mb-0">Already registered? <Link to="/login">Login</Link></p>
    </div></div>
  );
}
