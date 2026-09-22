// In-memory SMS log storage. Same pattern as caseRepository.js:
// a plain array, reset on server restart, no database.

let smsLog = [];

/** Adds an SMS log entry and returns it. */
function add(entry) {
  smsLog.push(entry);
  return entry;
}

/**
 * findAll(filters) -> array of log entries matching the filters, newest first.
 * filters (optional):
 *   - assignedTo: exact match on who the SMS was sent to
 */
function findAll(filters = {}) {
  const results = smsLog.filter((entry) => {
    if (filters.assignedTo && entry.to !== filters.assignedTo) return false;
    return true;
  });
  return [...results].sort((a, b) => b.at - a.at);
}

/** Removes every log entry. Used by the demo reset endpoint. */
function clear() {
  smsLog = [];
}

/** How many entries are currently stored. Mostly useful for tests. */
function count() {
  return smsLog.length;
}

module.exports = { add, findAll, clear, count };