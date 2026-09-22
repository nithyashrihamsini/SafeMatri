const clock = require("../../src/services/demoClockService.js");
const caseService = require("../../src/services/caseService.js");
const { STATUS } = require("../../src/constants/enums.js");

beforeEach(() => {
  clock.resetDemo(); // also reseeds, giving each test a known starting point
});

describe("demoClockService.fastForward", () => {
  test("advances the offset by the given minutes", () => {
    clock.fastForward(60);
    expect(clock.getOffsetMinutes()).toBe(60);
  });

  test("stacks across multiple calls", () => {
    clock.fastForward(60);
    clock.fastForward(60);
    expect(clock.getOffsetMinutes()).toBe(120);
  });

  test("increases every case's waitMinutes", () => {
    const before = caseService.listQueue({ status: STATUS.NEW })[0].waitMinutes;
    clock.fastForward(360);
    const after = caseService.listQueue({ status: STATUS.NEW })[0].waitMinutes;
    expect(after).toBeGreaterThan(before);
    expect(after - before).toBeCloseTo(360, 0);
  });
});

describe("demoClockService.resetDemo", () => {
  test("resets the offset back to 0", () => {
    clock.fastForward(500);
    clock.resetDemo();
    expect(clock.getOffsetMinutes()).toBe(0);
  });

  test("reseeds back to 10 total cases, even after extra cases were added", () => {
    caseService.createCase({ area: "A", symptoms: ["fever"] });
    caseService.createCase({ area: "B", symptoms: ["heavy_bleeding"] });
    expect(caseService.listQueue({}).length).toBe(12);

    clock.resetDemo();
    expect(caseService.listQueue({}).length).toBe(10);
  });
});
