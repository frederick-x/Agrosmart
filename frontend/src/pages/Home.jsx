import { Link } from "react-router-dom";

const STEPS = [
  ["bi-pencil-square", "1. Enter farm details", "Fill in your soil nutrients, pH, soil type, weather and location."],
  ["bi-cpu", "2. Smart analysis", "A Random Forest machine-learning model compares your inputs with crop data."],
  ["bi-flower1", "3. Get your crop", "See the best crop, why it suits you, and basic cultivation guidance."],
];
const BENEFITS = [
  ["bi-graph-up-arrow", "Better yield planning", "Choose crops that match your land and climate."],
  ["bi-cash-coin", "Lower risk", "Avoid crops that are unlikely to do well in your conditions."],
  ["bi-droplet-half", "Smarter resource use", "Get general fertilizer and irrigation guidance."],
  ["bi-translate", "Simple to use", "Clear labels and sample values – no technical background needed."],
];
const FEATURES = [
  "ML-based crop recommendation", "Why-this-crop explanation", "Crop information library (22 crops)",
  "Recommendation history", "Saved crops", "Works on mobile, tablet and desktop",
];
const CROPS = ["Rice", "Maize", "Chickpea", "Kidney Beans", "Pigeon Peas", "Moth Beans", "Mung Bean", "Black Gram", "Lentil", "Pomegranate", "Banana", "Mango", "Grapes", "Watermelon", "Muskmelon", "Apple", "Orange", "Papaya", "Coconut", "Cotton", "Jute", "Coffee"];

function HeroArt() {
  return (
    <svg viewBox="0 0 400 300" className="img-fluid" role="img" aria-label="Farm field illustration">
      <rect width="400" height="300" rx="24" fill="#e3f4e4" />
      <circle cx="320" cy="60" r="34" fill="#ffd54f" />
      <path d="M0 190 Q100 140 200 175 T400 160 V300 H0Z" fill="#81c784" />
      <path d="M0 230 Q120 190 220 220 T400 205 V300 H0Z" fill="#43a047" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} transform={`translate(${30 + i * 45} ${245 + (i % 2) * 12})`}>
          <path d="M0 20 V-8" stroke="#1b5e20" strokeWidth="3" />
          <ellipse cx="-7" cy="-6" rx="8" ry="4" fill="#2e7d32" transform="rotate(-30 -7 -6)" />
          <ellipse cx="7" cy="-12" rx="8" ry="4" fill="#2e7d32" transform="rotate(30 7 -12)" />
        </g>
      ))}
      <rect x="70" y="105" width="70" height="55" fill="#a1887f" /><path d="M62 108 L105 70 L148 108Z" fill="#6d4c41" />
      <rect x="95" y="125" width="20" height="35" fill="#5d4037" />
      <text x="200" y="130" fontSize="56" textAnchor="middle">🌾</text>
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="chip mb-3"><i className="bi bi-stars me-1"></i>AI for Agriculture</span>
              <h1 className="display-5">Smart Crop Recommendation for Better Farming</h1>
              <p className="lead my-3">Make data-driven farming decisions using soil and environmental conditions.</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/recommend" className="btn btn-agro btn-lg">Get Crop Recommendation</Link>
                <a href="#how" className="btn btn-outline-agro btn-lg">Learn More</a>
              </div>
            </div>
            <div className="col-lg-6"><HeroArt /></div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          <div className="row g-4">
            {STEPS.map(([icon, t, d]) => (
              <div className="col-md-4" key={t}><div className="card card-agro p-4 text-center">
                <div className="icon-circle mx-auto mb-3"><i className={`bi ${icon}`}></i></div><h5>{t}</h5><p className="text-muted mb-0">{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-green-soft">
        <div className="container">
          <h2 className="text-center mb-4">Benefits</h2>
          <div className="row g-4">
            {BENEFITS.map(([icon, t, d]) => (
              <div className="col-sm-6 col-lg-3" key={t}><div className="card card-agro p-4">
                <div className="icon-circle mb-3"><i className={`bi ${icon}`}></i></div><h6 className="fw-bold">{t}</h6><p className="small text-muted mb-0">{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">Features</h2>
          <div className="row g-3 justify-content-center">
            {FEATURES.map((f) => (
              <div className="col-md-4 col-sm-6" key={f}><div className="card card-agro p-3"><i className="bi bi-check-circle-fill text-green me-2"></i>{f}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-green-soft">
        <div className="container text-center">
          <h2 className="mb-3">Supported Crops</h2>
          <div>{CROPS.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
          <Link to="/crops" className="btn btn-agro mt-3">Explore crop information</Link>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h2>About the System</h2>
              <p>AgroSmart is a decision-support system built for an IT in Agriculture project. Farmers enter soil nutrients (N, P, K), pH, temperature, humidity and rainfall. A Random Forest classifier trained with Scikit-learn predicts the most suitable crop and gives a confidence score.</p>
              <p className="mb-0">Soil type and location are not part of the ML dataset, so they are handled separately: soil type is compared with the crop's preferred soils, and location is stored with your history.</p>
            </div>
            <div className="col-lg-6"><div className="alert alert-warning mb-0"><i className="bi bi-exclamation-triangle me-2"></i><strong>Please note:</strong> recommendations are guidance only and are not guaranteed. Always consult a local agricultural expert before important farming decisions.</div></div>
          </div>
        </div>
      </section>
    </>
  );
}
