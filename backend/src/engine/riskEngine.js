const { RISK } = require("../constants/enums.js");
const { RULES, MODERATE_SIGNS } = require("../data/rules.js");

// Ranks so we can compare risk levels and keep the highest one.
const RANK = { [RISK.LOW]: 0, [RISK.MODERATE]: 1, [RISK.HIGH]: 2 };

/**
 * evaluate(symptoms)
 * symptoms - array of symptom keys, e.g. ["severe_headache", "blurred_vision"]
 *
 * Returns { risk, emergency, reasons }
 * - risk:      RISK.LOW, RISK.MODERATE or RISK.HIGH
 * - emergency: true if any matching rule is an emergency danger sign
 * - reasons:   plain-language reasons for the final risk level
 */
function evaluate(symptoms) {
  const has = (key) => symptoms.includes(key);

  // Find every rule whose required symptoms are all present.
  const hits = RULES.filter((rule) => rule.all.every(has));

  // Extra rule: 3 or more moderate signs together push the risk to HIGH,
  // even if no specific combination rule above matched.
  if (MODERATE_SIGNS.filter(has).length >= 3) {
    hits.push({
      risk: RISK.HIGH,
      reason: "Several warning signs together need prompt checking.",
    });
  }

  // Keep the highest risk level among everything that matched.
  let risk = RISK.LOW;
  for (const hit of hits) {
    if (RANK[hit.risk] > RANK[risk]) risk = hit.risk;
  }

  // Emergency if any matching rule (at any risk level) is marked emergency.
  const emergency = hits.some((hit) => hit.emergency);

  // Only show reasons for rules that match the final risk level,
  // with emergency reasons listed first.
  let reasons = hits
    .filter((hit) => hit.risk === risk)
    .sort((a, b) => (b.emergency ? 1 : 0) - (a.emergency ? 1 : 0))
    .map((hit) => hit.reason);

  if (hits.length === 0) {
    reasons = ["No warning signs were reported."];
  }

  return { risk, emergency, reasons };
}

module.exports = { evaluate };