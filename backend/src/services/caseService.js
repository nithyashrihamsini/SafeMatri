const { STATUS } = require("../constants/enums.js");
const caseRepo = require("../repositories/caseRepository.js");
const smsLogRepo = require("../repositories/smsLogRepository.js");

const { evaluate } = require("../engine/riskEngine.js");
const { detect } = require("../engine/symptomDetector.js");
const { route } = require("../engine/recipientRouter.js");
const { buildReport } = require("../engine/reportBuilder.js");
const { buildSms } = require("../engine/smsBuilder.js");
const { sortQueue, waitMinutes } = require("../engine/priorityCalculator.js");

const { now } = require("../utils/time.js");
const { demoLocation } = require("../utils/geo.js");
const { SEED_CASES } = require("../data/seedCases.js");

let seq = 100;
function nextId(areaKey) {
  seq += 1;
  return `${areaKey}-${seq}`;
}

/**
 * createCase(input) -> the newly created case.
 * input:
 *   - name        (optional string)
 *   - area        "A" | "B" | "C" | "D"
 *   - words       (optional string, her own description)
 *   - symptoms    array of symptom keys she confirmed
 *   - location    { lat, lng, demo } or null
 *   - createdAt   (optional, defaults to now() — mainly used by seeding)
 *   - status      (optional, defaults to STATUS.NEW — mainly used by seeding)
 *
 * Runs the risk engine, builds the report and SMS, decides the recipient,
 * stores the case, and logs the SMS. This is the single place all of that
 * happens, so assessController and the future seeding logic both call this
 * instead of duplicating the steps.
 */
function createCase(input) {
  const result = evaluate(input.symptoms || []);
  const { assignedTo, fallback } = route(input.area);
  const createdAt = input.createdAt === undefined ? now() : input.createdAt;

  const caseItem = {
    id: nextId(input.area),
    name: (input.name || "").trim(),
    area: input.area,
    words: (input.words || "").trim(),
    symptoms: [...(input.symptoms || [])],
    risk: result.risk,
    emergency: result.emergency,
    reasons: result.reasons,
    location: input.location || null,
    createdAt,
    status: input.status || STATUS.NEW,
    assignedTo,
    fallback,
  };

  caseItem.report = buildReport(caseItem);
  caseItem.sms = buildSms(caseItem);

  caseRepo.add(caseItem);
  smsLogRepo.add({
    at: caseItem.createdAt,
    to: caseItem.assignedTo,
    text: caseItem.sms,
    caseId: caseItem.id,
    fallback: caseItem.fallback,
  });

  return caseItem;
}

/**
 * listQueue(filters) -> array of cases matching filters, sorted by priority
 * (highest priority first). filters: { status, assignedTo, area } — all optional,
 * same as caseRepository.findAll.
 */
function listQueue(filters = {}) {
  const cases = caseRepo.findAll(filters);
  return sortQueue(cases).map((c) => ({
    ...c,
    waitMinutes: waitMinutes(c.createdAt),
  }));
}

/** getCase(id) -> the case, or null if not found. */
function getCase(id) {
  return caseRepo.findById(id) || null;
}

/**
 * setStatus(id, status) -> the updated case, or null if not found.
 * status must be one of STATUS.NEW / STATUS.VISITED / STATUS.RESOLVED
 * (validated in B8, not here).
 */
function setStatus(id, status) {
  return caseRepo.update(id, { status });
}

/**
 * seedDemoCases() -> clears existing cases/SMS log and recreates the
 * 10 fictional demo cases from data/seedCases.js, backdated using
 * minutesAgo so the priority queue looks realistic immediately.
 */
function seedDemoCases() {
  caseRepo.clear();
  smsLogRepo.clear();
  seq = 100;

  SEED_CASES.forEach((seed) => {
    createCase({
      area: seed.area,
      symptoms: seed.symptoms,
      words: seed.words,
      location: demoLocation(seed.area),
      createdAt: now() - seed.minutesAgo * 60000,
      status: seed.status || STATUS.NEW,
    });
  });
}

module.exports = {
  createCase,
  listQueue,
  getCase,
  setStatus,
  seedDemoCases,
};