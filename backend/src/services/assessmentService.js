const { detect } = require("../engine/symptomDetector.js");
const { evaluate } = require("../engine/riskEngine.js");

const NO_MEDICINE_DISCLAIMER =
  "This is a risk indication, not a diagnosis. SafeMatri does not suggest medicines.";

function adviceFor(result) {
  if (result.emergency) {
    return "Go to the nearest hospital now. Ask someone to take you, or call your local emergency number or ambulance. You can also alert your health worker.";
  }
  if (result.risk === "HIGH") {
    return "A health worker should check you soon. Alert your nearby health worker. If you feel worse, or you have bleeding, fits, or trouble breathing, go to the hospital right away.";
  }
  if (result.risk === "MODERATE") {
    return "Please tell a health worker soon and get checked at your next visit, or sooner. If you feel worse, go to the hospital.";
  }
  return "No warning signs were found. Keep going to your regular check-ups, and check again if anything changes.";
}

/**
 * assess(input) -> { detected, risk, emergency, reasons, advice, disclaimer }
 * input:
 *   - words    (optional string, her free-text description)
 *   - symptoms (optional array of symptom keys she's already ticked)
 *
 * Combines detection (from words) with any symptoms she ticked directly,
 * then evaluates the combined set. Does not store anything — this is a
 * read-only check, so she can see her Risk Meter before deciding whether
 * to send an alert.
 */
function assess(input) {
  const detected = detect(input.words || "");
  const combined = [...new Set([...(input.symptoms || []), ...detected])];

  const result = evaluate(combined);

  return {
    detected,
    symptoms: combined,
    risk: result.risk,
    emergency: result.emergency,
    reasons: result.reasons,
    advice: adviceFor(result),
    disclaimer: NO_MEDICINE_DISCLAIMER,
  };
}

module.exports = { assess };