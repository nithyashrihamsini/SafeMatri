const demoClockService = require("../services/demoClockService.js");
const { AppError } = require("../utils/errors.js");

// POST /api/demo/fast-forward  { minutes?: number }  (default 360)
function fastForward(req, res, next) {
  const minutes = req.body.minutes === undefined ? 360 : req.body.minutes;
  if (typeof minutes !== "number" || minutes <= 0) {
    return next(new AppError("'minutes' must be a positive number.", 400, "INVALID_MINUTES"));
  }
  const offset = demoClockService.fastForward(minutes);
  res.json({ offsetMinutes: offset });
}

// POST /api/demo/reset
function resetDemo(req, res) {
  demoClockService.resetDemo();
  res.json({ ok: true, offsetMinutes: demoClockService.getOffsetMinutes() });
}

module.exports = { fastForward, resetDemo };