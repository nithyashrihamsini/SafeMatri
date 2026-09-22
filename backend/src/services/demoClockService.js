const timeUtil = require("../utils/time.js");
const caseService = require("./caseService.js");

/**
 * fastForward(minutes) -> the new offset in minutes.
 * Advances the demo clock, so every case's waiting time (and therefore
 * priority) appears to jump forward without waiting for real time to pass.
 */
function fastForward(minutes) {
  return timeUtil.advanceClock(minutes);
}

/**
 * resetDemo() -> nothing. Resets the demo clock back to real time AND
 * reloads the 10 seed cases, so "Reset demo data" puts everything back
 * to a clean starting point in one call.
 */
function resetDemo() {
  timeUtil.resetClock();
  caseService.seedDemoCases();
}

/** getOffsetMinutes() -> how far ahead of real time the demo clock currently is. */
function getOffsetMinutes() {
  return timeUtil.getOffsetMinutes();
}

module.exports = { fastForward, resetDemo, getOffsetMinutes };