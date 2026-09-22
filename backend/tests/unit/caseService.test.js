const caseService = require("../../src/services/caseService.js");
const caseRepo = require("../../src/repositories/caseRepository.js");
const smsLogRepo = require("../../src/repositories/smsLogRepository.js");
const { STATUS, RISK } = require("../../src/constants/enums.js");

// Every test starts from a clean, empty store — otherwise cases created
// in one test would leak into the next test's queue and break counts.
beforeEach(() => {
  caseRepo.clear();
  smsLogRepo.clear();
});

describe("caseService.createCase", () => {
  test("creates a case with a report, SMS, and recipient", () => {
    const c = caseService.createCase({
      area: "A",
      symptoms: ["severe_headache", "blurred_vision"],
      words: "my head is paining a lot",
      location: { lat: 1, lng: 2, demo: true },
    });

    expect(c.id).toMatch(/^A-\d+$/);
    expect(c.risk).toBe(RISK.HIGH);
    expect(c.assignedTo).toBe("Health Worker Meena");
    expect(c.fallback).toBe(false);
    expect(c.status).toBe(STATUS.NEW);
    expect(c.report).toContain("SAFEMATRI - SYMPTOM & RISK REPORT");
    expect(c.sms).toContain("SafeMatri ALERT");
  });

  test("stores the case so it can be found by id", () => {
    const c = caseService.createCase({ area: "B", symptoms: ["fever"] });
    expect(caseService.getCase(c.id)).toEqual(c);
  });

  test("logs an SMS entry for every created case", () => {
    caseService.createCase({ area: "A", symptoms: ["fever"] });
    caseService.createCase({ area: "B", symptoms: ["heavy_bleeding"] });
    expect(smsLogRepo.count()).toBe(2);
  });

  test("routes Village D to the clinic fallback", () => {
    const c = caseService.createCase({ area: "D", symptoms: ["fever"] });
    expect(c.assignedTo).toBe("Primary Health Centre (nearest clinic)");
    expect(c.fallback).toBe(true);
  });

  test("each case gets a unique, incrementing id even across areas", () => {
    const c1 = caseService.createCase({ area: "A", symptoms: [] });
    const c2 = caseService.createCase({ area: "B", symptoms: [] });
    expect(c1.id).not.toBe(c2.id);
  });

  test("defaults to an empty symptom list -> LOW risk", () => {
    const c = caseService.createCase({ area: "A" });
    expect(c.risk).toBe(RISK.LOW);
    expect(c.symptoms).toEqual([]);
  });
});

describe("caseService.listQueue", () => {
  test("returns cases sorted by priority, highest first", () => {
    caseService.createCase({ area: "A", symptoms: ["swollen_feet"] }); // LOW
    caseService.createCase({ area: "B", symptoms: ["heavy_bleeding"] }); // emergency
    caseService.createCase({ area: "C", symptoms: ["fever"] }); // MODERATE

    const queue = caseService.listQueue({ status: STATUS.NEW });
    expect(queue.map((c) => c.risk)).toEqual([RISK.HIGH, RISK.MODERATE, RISK.LOW]);
    expect(queue[0].emergency).toBe(true);
  });

  test("each case in the queue includes a waitMinutes value", () => {
    caseService.createCase({ area: "A", symptoms: ["fever"] });
    const queue = caseService.listQueue({ status: STATUS.NEW });
    expect(typeof queue[0].waitMinutes).toBe("number");
    expect(queue[0].waitMinutes).toBeGreaterThanOrEqual(0);
  });

  test("filters by status", () => {
    const c1 = caseService.createCase({ area: "A", symptoms: ["fever"] });
    caseService.createCase({ area: "B", symptoms: ["fever"] });
    caseService.setStatus(c1.id, STATUS.RESOLVED);

    const newOnly = caseService.listQueue({ status: STATUS.NEW });
    expect(newOnly.find((c) => c.id === c1.id)).toBeUndefined();
    expect(newOnly.length).toBe(1);
  });

  test("filters by assignedTo", () => {
    caseService.createCase({ area: "A", symptoms: ["fever"] }); // Meena
    caseService.createCase({ area: "B", symptoms: ["fever"] }); // Lakshmi

    const meenaOnly = caseService.listQueue({ assignedTo: "Health Worker Meena" });
    expect(meenaOnly.length).toBe(1);
    expect(meenaOnly[0].assignedTo).toBe("Health Worker Meena");
  });
});

describe("caseService.getCase", () => {
  test("returns null for an unknown id", () => {
    expect(caseService.getCase("Z-999")).toBeNull();
  });
});

describe("caseService.setStatus", () => {
  test("updates the status of an existing case", () => {
    const c = caseService.createCase({ area: "A", symptoms: ["fever"] });
    const updated = caseService.setStatus(c.id, STATUS.VISITED);
    expect(updated.status).toBe(STATUS.VISITED);
    expect(caseService.getCase(c.id).status).toBe(STATUS.VISITED);
  });

  test("returns null for an unknown id", () => {
    expect(caseService.setStatus("Z-999", STATUS.VISITED)).toBeNull();
  });
});

describe("caseService.seedDemoCases", () => {
  test("creates exactly 10 cases", () => {
    caseService.seedDemoCases();
    const all = caseService.listQueue({});
    // listQueue with no status filter returns everything, new + visited
    expect(all.length).toBe(10);
  });

  test("9 are new and 1 is pre-marked visited, matching seedCases.js", () => {
    caseService.seedDemoCases();
    expect(caseService.listQueue({ status: STATUS.NEW }).length).toBe(9);
    expect(caseService.listQueue({ status: STATUS.VISITED }).length).toBe(1);
  });

  test("clears any previously existing cases before reseeding", () => {
    caseService.createCase({ area: "A", symptoms: ["fever"] });
    caseService.seedDemoCases();
    expect(caseService.listQueue({}).length).toBe(10); // not 11
  });
});