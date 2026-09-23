const { assess } = require("../services/assessmentService.js");

// POST /api/assess
function postAssess(req, res) {
  const result = assess(req.body);
  res.json(result);
}

module.exports = { postAssess };