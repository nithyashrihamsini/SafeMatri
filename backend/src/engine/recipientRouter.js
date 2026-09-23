const { AREAS, CLINIC } = require("../data/areas.js");

/**
 * route(areaKey) -> { assignedTo, fallback }
 * - assignedTo: the health worker's name, or the clinic name if none is assigned
 * - fallback:   true if there was no health worker and the clinic was used instead
 */
function route(areaKey) {
  const area = AREAS[areaKey];
  if (!area) {
    throw new Error(`Unknown area: ${areaKey}`);
  }

  if (area.worker) {
    return { assignedTo: area.worker, fallback: false };
  }

  return { assignedTo: CLINIC, fallback: true };
}

module.exports = { route };