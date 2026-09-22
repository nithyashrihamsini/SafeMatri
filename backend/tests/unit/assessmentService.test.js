const { assess } = require("../../src/services/assessmentService.js");
const { RISK } = require("../../src/constants/enums.js");

describe("assessmentService.assess", () => {
  test("detects symptoms from words alone", () => {
    const result = assess({ words: "there is a lot of bleeding" });
    expect(result.detected).toContain("heavy_bleeding");
    expect(result.symptoms).toContain("heavy_bleeding");
    expect(result.risk).toBe(RISK.HIGH);
    expect(result.emergency).toBe(true);
  });

  test("combines ticked symptoms with detected ones, no duplicates", () => {
    const result = assess({
      words: "my head is paining a lot",
      symptoms: ["severe_headache", "swollen_feet"],
    });
    // severe_headache appears in both words and the ticked list -> should not duplicate
    const count = result.symptoms.filter((s) => s === "severe_headache").length;
    expect(count).toBe(1);
    expect(result.symptoms).toContain("swollen_feet");
  });

  test("works with only ticked symptoms and no words", () => {
    const result = assess({ symptoms: ["fever"] });
    expect(result.risk).toBe(RISK.MODERATE);
    expect(result.detected).toEqual([]);
  });

  test("works with no input at all -> LOW, no warning signs", () => {
    const result = assess({});
    expect(result.risk).toBe(RISK.LOW);
    expect(result.symptoms).toEqual([]);
  });

  test("emergency advice mentions going to hospital now", () => {
    const result = assess({ words: "there is a lot of bleeding" });
    expect(result.advice).toMatch(/hospital now/i);
  });

  test("LOW risk advice does not tell her to go to hospital", () => {
    const result = assess({ symptoms: ["swollen_feet"] });
    expect(result.advice).not.toMatch(/hospital/i);
  });

  test("always includes the no-medicines disclaimer", () => {
    const result = assess({ symptoms: ["fever"] });
    expect(result.disclaimer).toMatch(/does not suggest medicines/i);
  });

  test("never stores anything (repositories stay empty)", () => {
    const caseRepo = require("../../src/repositories/caseRepository.js");
    caseRepo.clear();
    assess({ words: "there is a lot of bleeding" });
    expect(caseRepo.count()).toBe(0);
  });
});