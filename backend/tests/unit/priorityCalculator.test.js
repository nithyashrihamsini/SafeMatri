const {
  waitMinutes,
  priority,
  sortQueue,
} = require("../../src/engine/priorityCalculator.js");
const { RISK } = require("../../src/constants/enums.js");
const PRIORITY_CONFIG = require("../../src/config/priority.config.js");

describe("priorityCalculator.waitMinutes", () => {
  test("returns ~0 for a case created just now", () => {
    const result = waitMinutes(Date.now());
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  test("returns ~60 for a case created an hour ago", () => {
    const oneHourAgo = Date.now() - 60 * 60000;
    expect(waitMinutes(oneHourAgo)).toBeCloseTo(60, 0);
  });

  test("never returns a negative number, even for a future timestamp", () => {
    const future = Date.now() + 5 * 60000;
    expect(waitMinutes(future)).toBe(0);
  });
});

describe("priorityCalculator.priority", () => {
  test("HIGH risk scores higher than MODERATE at the same wait time", () => {
    const createdAt = Date.now() - 10 * 60000;
    const high = priority({ risk: RISK.HIGH, emergency: false, createdAt });
    const moderate = priority({
      risk: RISK.MODERATE,
      emergency: false,
      createdAt,
    });
    expect(high).toBeGreaterThan(moderate);
  });

  test("MODERATE risk scores higher than LOW at the same wait time", () => {
    const createdAt = Date.now() - 10 * 60000;
    const moderate = priority({
      risk: RISK.MODERATE,
      emergency: false,
      createdAt,
    });
    const low = priority({ risk: RISK.LOW, emergency: false, createdAt });
    expect(moderate).toBeGreaterThan(low);
  });

  test("emergency always outranks a non-emergency HIGH, even if the HIGH case waited longer", () => {
    const now = Date.now();
    const emergency = priority({
      risk: RISK.HIGH,
      emergency: true,
      createdAt: now - 1 * 60000, // just reported
    });
    const highWaitedLong = priority({
      risk: RISK.HIGH,
      emergency: false,
      createdAt: now - 5000 * 60000, // waited a very long time
    });
    expect(emergency).toBeGreaterThan(highWaitedLong);
  });

  test("a longer wait raises priority for the same risk level", () => {
    const now = Date.now();
    const justIn = priority({
      risk: RISK.LOW,
      emergency: false,
      createdAt: now,
    });
    const waitedAWhile = priority({
      risk: RISK.LOW,
      emergency: false,
      createdAt: now - 120 * 60000,
    });
    expect(waitedAWhile).toBeGreaterThan(justIn);
  });

  test("matches the configured weight for a freshly reported case", () => {
    const result = priority({
      risk: RISK.MODERATE,
      emergency: false,
      createdAt: Date.now(),
    });
    expect(result).toBeCloseTo(PRIORITY_CONFIG.weights.MODERATE, 0);
  });
});

describe("priorityCalculator.sortQueue", () => {
  const now = Date.now();
  const cases = [
    { id: "low-old", risk: RISK.LOW, emergency: false, createdAt: now - 700 * 60000 },
    { id: "high-new", risk: RISK.HIGH, emergency: false, createdAt: now - 5 * 60000 },
    { id: "emergency", risk: RISK.HIGH, emergency: true, createdAt: now - 8 * 60000 },
    { id: "moderate", risk: RISK.MODERATE, emergency: false, createdAt: now - 60 * 60000 },
  ];

  test("orders emergency first, then by risk, matching the sample scenario", () => {
    const order = sortQueue(cases).map((c) => c.id);
    expect(order).toEqual(["emergency", "high-new", "moderate", "low-old"]);
  });

  test("does not mutate the original array", () => {
    const original = [...cases];
    sortQueue(cases);
    expect(cases).toEqual(original);
    expect(cases[0].id).toBe("low-old"); // original order preserved
  });

  test("returns a new array, not the same reference", () => {
    const result = sortQueue(cases);
    expect(result).not.toBe(cases);
  });

  test("handles an empty queue without throwing", () => {
    expect(() => sortQueue([])).not.toThrow();
    expect(sortQueue([])).toEqual([]);
  });
});