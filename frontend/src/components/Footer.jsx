import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h5 className="text-white"><i className="bi bi-flower2 me-1"></i>AgroSmart</h5>
            <p className="small">A decision-support tool that suggests suitable crops from soil and weather conditions. It does not replace advice from agricultural experts.</p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white">Quick links</h6>
            <div className="d-flex flex-column small gap-1">
              <Link to="/recommend">Crop Recommendation</Link>
              <Link to="/crops">Crop Information</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
        <hr className="border-light opacity-25" />
        <p className="text-center small mb-0">© {new Date().getFullYear()} AgroSmart. For educational use.</p>
      </div>
    </footer>
  );
}
