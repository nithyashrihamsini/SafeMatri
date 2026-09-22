// In-memory case storage. No database — this array is the only "storage"
// for now, and it resets whenever the server restarts. See B7 notes in
// docs/decisions.md for why, and what would change if a database is added.

let cases = [];

/** Adds a case and returns it. Expects caseItem to already have an id. */
function add(caseItem) {
  cases.push(caseItem);
  return caseItem;
}

/**
 * findAll(filters) -> array of cases matching the filters.
 * filters (all optional):
 *   - status:     "new" | "visited" | "resolved"
 *   - assignedTo: exact match on the assigned health worker / clinic name
 *   - area:       "A" | "B" | "C" | "D"
 */
function findAll(filters = {}) {
  return cases.filter((c) => {
    if (filters.status && c.status !== filters.status) return false;
    if (filters.assignedTo && c.assignedTo !== filters.assignedTo) return false;
    if (filters.area && c.area !== filters.area) return false;
    return true;
  });
}

/** findById(id) -> the case, or undefined if no case has that id. */
function findById(id) {
  return cases.find((c) => c.id === id);
}

/**
 * update(id, changes) -> the updated case, or null if no case has that id.
 * Merges "changes" onto the existing case (shallow merge).
 */
function update(id, changes) {
  const caseItem = findById(id);
  if (!caseItem) return null;
  Object.assign(caseItem, changes);
  return caseItem;
}

/** Removes every case. Used by the demo reset endpoint. */
function clear() {
  cases = [];
}

/** How many cases are currently stored. Mostly useful for tests. */
function count() {
  return cases.length;
}

module.exports = { add, findAll, findById, update, clear, count };