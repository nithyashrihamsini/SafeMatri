const smsLogRepo = require("../repositories/smsLogRepository.js");

// GET /api/sms-log?assignedTo=
function getSmsLog(req, res) {
  const { assignedTo } = req.query;
  const filters = {};
  if (assignedTo) filters.assignedTo = assignedTo;
  res.json(smsLogRepo.findAll(filters));
}

module.exports = { getSmsLog };