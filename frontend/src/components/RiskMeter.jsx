export default function RiskMeter({ score, level }) {
  const percent = (score / 10) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <strong>Risk meter</strong>
        <span className={"badge " + level}>{level} risk</span>
      </div>
      <div className="meter-track">
        <div className={"meter-fill " + level} style={{ width: percent + "%" }} />
      </div>
      <p className="note">Score: {score} / 10</p>
    </div>
  );
}