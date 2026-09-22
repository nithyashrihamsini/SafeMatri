// Tracks a "demo clock" offset in minutes, so the fast-forward demo
// feature can simulate time passing without waiting for real minutes
// to go by. Real deployments would just use Date.now() directly.

let offsetMinutes = 0;

/** Current time in milliseconds, including any demo fast-forward offset. */
function now() {
  return Date.now() + offsetMinutes * 60000;
}

/** Adds minutes to the demo clock (used by the fast-forward demo button). */
function advanceClock(minutes) {
  offsetMinutes += minutes;
  return offsetMinutes;
}

/** Resets the demo clock back to real time (used by the reset-demo button). */
function resetClock() {
  offsetMinutes = 0;
}

/** Returns the current offset, mostly useful for tests and debugging. */
function getOffsetMinutes() {
  return offsetMinutes;
}

module.exports = { now, advanceClock, resetClock, getOffsetMinutes };