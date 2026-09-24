import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SYMPTOMS } from "../data/symptoms";
import { submitScreening } from "../api/client";
import VoiceInput from "../components/VoiceInput";
const empty = {
  name: "", age: "", weeks: "", phone: "",
  systolic: "", diastolic: "", location: null, symptoms: [],
};

export default function Screening() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locMsg, setLocMsg] = useState("");
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSymptom = (id) => {
    const has = form.symptoms.includes(id);
    setForm({
      ...form,
      symptoms: has ? form.symptoms.filter((s) => s !== id) : [...form.symptoms, id],
    });
  };
const addVoiceSymptoms = (ids) => {
  setForm((f) => ({ ...f, symptoms: Array.from(new Set([...f.symptoms, ...ids])) }));
};
  const shareLocation = () => {
    if (!navigator.geolocation) return setLocMsg("Location not supported on this device.");
    setLocMsg("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        setLocMsg("Location shared ✓");
      },
      () => setLocMsg("Could not get location. You can still continue.")
    );
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.age || !form.weeks || !form.phone) {
      return setError("Please fill name, age, weeks of pregnancy and phone.");
    }
    setLoading(true);
    try {
      const result = await submitScreening(form);
      navigate("/result", { state: { result } });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Health check</h2>

      <div className="card">
        <div className="field">
          <label>Your name</label>
          <input type="text" name="name" value={form.name} onChange={update} />
        </div>
        <div className="row">
          <div className="field">
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={update} />
          </div>
          <div className="field">
            <label>Weeks pregnant</label>
            <input type="number" name="weeks" value={form.weeks} onChange={update} />
          </div>
        </div>
        <div className="field">
          <label>Phone number</label>
          <input type="tel" name="phone" value={form.phone} onChange={update} />
        </div>
        <div className="row">
          <div className="field">
            <label>BP top number (optional)</label>
            <input type="number" name="systolic" value={form.systolic} onChange={update} placeholder="e.g. 120" />
          </div>
          <div className="field">
            <label>BP bottom number (optional)</label>
            <input type="number" name="diastolic" value={form.diastolic} onChange={update} placeholder="e.g. 80" />
          </div>
        </div>
      </div>
<VoiceInput onSymptoms={addVoiceSymptoms} />
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Are you having any of these?</h3>
        
        <div className="symptom-grid">
          {SYMPTOMS.map((s) => {
            const checked = form.symptoms.includes(s.id);
            return (
              <div
                key={s.id}
                className={`symptom ${checked ? "checked" : ""}`}
                onClick={() => toggleSymptom(s.id)}
              >
                <input type="checkbox" checked={checked} readOnly />
                <label>{s.label}</label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <p style={{ marginBottom: 8 }}>Share your location so a health worker can find you if needed.</p>
        <button className="btn secondary" onClick={shareLocation}>Share my location</button>
        <span className="note" style={{ marginLeft: 12 }}>{locMsg}</span>
      </div>

      {error && <p style={{ color: "var(--high)", marginBottom: 12 }}>{error}</p>}
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Checking..." : "Check my risk"}
      </button>
    </div>
  );
}