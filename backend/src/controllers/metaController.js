const { SYMPTOMS } = require("../data/symptoms.js");
const { AREAS } = require("../data/areas.js");
const { STATUS } = require("../constants/enums.js");
const PRIORITY_CONFIG = require("../config/priority.config.js");

// GET /api/meta — lets the frontend build its screens from real backend data
// instead of hardcoding symptom lists, areas, and statuses on its own.
function getMeta(req, res) {
  res.json({
    symptoms: SYMPTOMS,
    areas: AREAS,
    statuses: Object.values(STATUS),
    priority: PRIORITY_CONFIG,
  });
}

module.exports = { getMeta };