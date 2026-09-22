const { now } = require("../utils/time.js");
const PRIORITY_CONFIG = require("../config/priority.config.js");

/**
 * waitMinutes(createdAt)
 * createdAt - timestamp (ms) of when the case was reported
 * Returns how many minutes ago that was, using the demo clock. Never negative.
 */
function waitMinutes(createdAt) {
  return Math.max(0, (now() - createdAt) / 60000);
}

/**
 * priority(caseItem)
 * caseItem - { risk, emergency, createdAt }
 *
 * Returns a number. Higher = more urgent = should be seen first.
 * Emergency cases always use emergencyWeight, which stays above every
 * other possible score, so they always sort to the top of the queue.
 */
function priority(caseItem) {
  const base = caseItem.emergency
    ? PRIORITY_CONFIG.emergencyWeight
    : PRIORITY_CONFIG.weights[caseItem.risk];

  return base + waitMinutes(caseItem.createdAt) * PRIORITY_CONFIG.agingPerMinute;
}

/**
 * sortQueue(cases)
 * Returns a NEW array sorted highest priority first.
 * Does not modify the array you pass in.
 */
function sortQueue(cases) {
  return [...cases].sort((a, b) => priority(b) - priority(a));
}

module.exports = { waitMinutes, priority, sortQueue };