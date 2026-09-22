const { RISK } = require("../constants/enums.js");

// Danger-sign rules. Each rule fires when the woman has ALL of the
// symptoms listed in "all". If more than one rule fires, the risk engine
// keeps the highest risk level among them (see src/engine/riskEngine.js).
//
// These rules are illustrative, based on general maternal danger-sign
// guidance, and MUST be reviewed by a clinician before any real-world use.
// See docs/rules-guide.md for the review log.

const RULES = [
  { all: ["heavy_bleeding"],        risk: RISK.HIGH, emergency: true,  reason: "Heavy bleeding in pregnancy is an emergency danger sign." },
  { all: ["convulsions"],           risk: RISK.HIGH, emergency: true,  reason: "Fits or convulsions in pregnancy are an emergency danger sign." },
  { all: ["difficulty_breathing"],  risk: RISK.HIGH, emergency: true,  reason: "Trouble breathing is an emergency danger sign." },

  { all: ["severe_headache", "blurred_vision"],
    risk: RISK.HIGH,
    reason: "A severe headache together with blurred vision can be a warning sign of dangerously high blood pressure." },

  { all: ["severe_headache", "swelling_face_hands"],
    risk: RISK.HIGH,
    reason: "A severe headache together with swelling of the face or hands can be a warning sign of dangerously high blood pressure." },

  { all: ["reduced_movement"],      risk: RISK.HIGH, reason: "Reduced baby movement needs prompt checking." },
  { all: ["severe_abdominal_pain"], risk: RISK.HIGH, reason: "Severe belly pain in pregnancy needs prompt checking." },
  { all: ["fluid_leak"],            risk: RISK.HIGH, reason: "Leaking fluid can be a warning sign and needs prompt checking." },

  { all: ["fever"],               risk: RISK.MODERATE, reason: "Fever in pregnancy should be checked by a health worker." },
  { all: ["severe_headache"],     risk: RISK.MODERATE, reason: "A severe headache should be checked by a health worker." },
  { all: ["blurred_vision"],      risk: RISK.MODERATE, reason: "Blurred vision should be checked by a health worker." },
  { all: ["swelling_face_hands"], risk: RISK.MODERATE, reason: "Swelling of the face or hands should be checked by a health worker." },

  { all: ["swollen_feet"],  risk: RISK.LOW, reason: "Mild swelling of the feet is common. Mention it at your next check-up." },
  { all: ["mild_nausea"],   risk: RISK.LOW, reason: "Mild nausea or tiredness is common. Mention it at your next check-up." },
];

// If 3 or more of these moderate signs are reported together, the risk
// engine raises the result to HIGH even without a specific combination rule above.
const MODERATE_SIGNS = ["severe_headache", "blurred_vision", "swelling_face_hands", "fever"];

module.exports = { RULES, MODERATE_SIGNS };