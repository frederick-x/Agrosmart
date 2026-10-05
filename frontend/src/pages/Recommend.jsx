import { useState } from "react";
import RecommendationForm from "../components/RecommendationForm";
import ResultCard from "../components/ResultCard";
import { api } from "../services/api";

export default function Recommend() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverErrors, setServerErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  const predict = async (payload) => {
    setLoading(true); setError(""); setServerErrors({}); setNotice("");
    try {
      setResult(await api.predict(payload)); setSaved(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err.message); setServerErrors(err.errors || {}); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try { await api.saveRecommendation(result.recommendation_id); setSaved(true); setNotice("Recommendation saved to your dashboard."); }
    catch (err) { setError(err.message); }
    setSaving(false);
  };

  return (
    <div>
      <h3 className="fw-bold text-green mb-3">Crop Recommendation</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}
      {result ? (
        <ResultCard result={result} onSave={save} saving={saving} saved={saved} onReset={() => { setResult(null); setNotice(""); }} />
      ) : (
        <RecommendationForm onSubmit={predict} loading={loading} serverErrors={serverErrors} />
      )}
    </div>
  );
}
