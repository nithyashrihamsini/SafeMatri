const { RISK } = require("../constants/enums.js");
const { SYMPTOMS_BY_KEY } = require("../data/symptoms.js");
const { AREAS } = require("../data/areas.js");
const { fmtTime } = require("../utils/formatters.js");
const { mapsLink } = require("../utils/geo.js");

/** "Anonymous (Case A-102)" or "Kavya (Case A-102)" */
function who(caseItem) {
  return `${caseItem.name || "Anonymous"} (Case ${caseItem.id})`;
}

/** Comma-separated short labels, e.g. "Severe headache, Blurred vision" */
function signsText(caseItem) {
  if (!caseItem.symptoms.length) return "no warning signs";
  return caseItem.symptoms.map((k) => SYMPTOMS_BY_KEY[k].short).join(", ");
}

/** What the health worker should do next, based on risk and emergency. */
function nextStep(caseItem) {
  if (caseItem.emergency) {
    return "She was advised to go to the nearest hospital immediately. Please contact her now.";
  }
  if (caseItem.risk === RISK.HIGH) {
    return "Home check-up requested as soon as possible.";
  }
  if (caseItem.risk === RISK.MODERATE) {
    return "Please check on her soon.";
  }
  return "Routine follow-up at the next visit.";
}

/**
 * buildReport(caseItem) -> the full plain-text symptom & risk report.
 * caseItem needs: id, name, createdAt, area, risk, emergency, words,
 *                 symptoms, reasons, location
 */
function buildReport(caseItem) {
  const lines = [];

  lines.push("SAFEMATRI - SYMPTOM & RISK REPORT");
  lines.push("Auto-drafted for health worker review. Risk indication only, not a diagnosis.");
  lines.push("------------------------------------------------");
  lines.push(`Case: ${caseItem.id}${caseItem.name ? `  (${caseItem.name})` : ""}`);
  lines.push(`Reported: ${fmtTime(caseItem.createdAt)}`);
  lines.push(`Area: ${AREAS[caseItem.area].name}`);
  lines.push(
    `Risk Meter: ${caseItem.risk} RISK${
      caseItem.emergency ? "  (EMERGENCY: advised to go to hospital now)" : ""
    }`
  );
  lines.push("");

  lines.push("In her own words:");
  lines.push(
    caseItem.words
      ? `"${caseItem.words}"`
      : "(No description given. Signs were chosen from the list.)"
  );
  lines.push("");

  lines.push("Signs reported (her words -> suggested clinical term):");
  if (caseItem.symptoms.length) {
    caseItem.symptoms.forEach((k) => {
      const s = SYMPTOMS_BY_KEY[k];
      lines.push(`- ${s.label}  ->  ${s.term}`);
    });
  } else {
    lines.push("- None selected");
  }
  lines.push("");

  lines.push("Why this risk level:");
  caseItem.reasons.forEach((r) => lines.push(`- ${r}`));
  lines.push("");

  lines.push("Suggested next step:");
  lines.push(nextStep(caseItem));
  lines.push("");

  lines.push(
    `Location: ${
      caseItem.location
        ? `${caseItem.location.lat}, ${caseItem.location.lng}${
            caseItem.location.demo ? " (demo location)" : " (shared with consent)"
          }  ${mapsLink(caseItem.location)}`
        : "Not shared"
    }`
  );
  lines.push("");

  lines.push(
    "SafeMatri does not suggest medicines. Treatment decisions belong to the health worker or doctor."
  );

  return lines.join("\n");
}

module.exports = { buildReport, nextStep, signsText, who };