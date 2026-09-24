import { useLocation, Navigate, Link } from "react-router-dom";
import RiskMeter from "../components/RiskMeter";

export default function Result() {
  const { state } = useLocation();
  if (!state?.result) return <Navigate to="/screen" replace />;
  const r = state.result;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Hello {r.name}</h2>
        <RiskMeter score={r.score} level={r.level} />

        {r.alertSent && (
          <div className="alert-box">
            <strong>A nearby health worker has been alerted.</strong>
            <p>They will visit you for a home check-up. Please keep your phone with you.</p>
            {r.location && (
              <p className="note">
                Location sent: {r.location.lat.toFixed(4)}, {r.location.lng.toFixed(4)}
              </p>
            )}
            <p className="note">(Demo: SMS is simulated)</p>
          </div>
        )}

        {r.level === "Medium" && (
          <p style={{ marginTop: 12 }}>
            Please visit your nearest health center soon and share these symptoms.
          </p>
        )}
        {r.level === "Low" && (
          <p style={{ marginTop: 12 }}>
            No warning signs right now. Keep going to your regular check-ups.
          </p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Report</h3>
        <p><strong>Age:</strong> {r.age} &nbsp; <strong>Weeks:</strong> {r.weeks}</p>
        <p><strong>Phone:</strong> {r.phone}</p>
        <p style={{ marginTop: 8 }}><strong>Why this risk level:</strong></p>
        {r.reasons.length === 0 ? (
          <p>No symptoms or risk factors reported.</p>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {r.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        )}
        <p className="note">
          This is a screening tool, not a diagnosis. Only a doctor can diagnose or treat.
        </p>
      </div>

      <div className="no-print">
        <button className="btn" onClick={() => window.print()}>Print / save report</button>{" "}
        <Link to="/screen" className="btn secondary">New check</Link>
      </div>
    </div>
  );
}