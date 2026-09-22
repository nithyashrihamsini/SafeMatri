const { RISK } = require("../constants/enums.js");
const { AREAS } = require("../data/areas.js");
const { signsText, nextStep, who } = require("./reportBuilder.js");
const { mapsLink } = require("../utils/geo.js");

/**
 * buildSms(caseItem) -> the short simulated SMS text sent to the
 * assigned health worker (or clinic, if there's no health worker nearby).
 * caseItem needs: id, name, area, risk, emergency, symptoms, location
 */
function buildSms(caseItem) {
  const kind = caseItem.emergency
    ? "EMERGENCY"
    : caseItem.risk === RISK.HIGH
    ? "ALERT"
    : "UPDATE";

  const locationText = caseItem.location
    ? `Location: ${mapsLink(caseItem.location)}.`
    : "Location not shared.";

  const riskLabel = caseItem.emergency ? "EMERGENCY" : caseItem.risk;

  return (
    `SafeMatri ${kind} [${riskLabel}]: ${who(caseItem)} in ${
      AREAS[caseItem.area].name
    } reports ${signsText(caseItem)}. ${locationText} ${nextStep(
      caseItem
    )} Full report is on the SafeMatri dashboard.`
  );
}

module.exports = { buildSms };