const { evaluate } = require("../../src/engine/riskEngine.js");
const { RISK } = require("../../src/constants/enums.js");

describe("riskEngine.evaluate", () => {
  test("no symptoms -> LOW, not emergency, explains nothing found", () => {
    const result = evaluate([]);
    expect(result.risk).toBe(RISK.LOW);
    expect(result.emergency).toBe(false);
    expect(result.reasons).toEqual(["No warning signs were reported."]);
  });

  describe("single emergency signs -> HIGH, emergency: true", () => {
    test.each([
      ["heavy_bleeding"],
      ["convulsions"],
      ["difficulty_breathing"],
    ])("%s", (symptom) => {
      const result = evaluate([symptom]);
      expect(result.risk).toBe(RISK.HIGH);
      expect(result.emergency).toBe(true);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe("single HIGH signs that are NOT emergencies", () => {
    test.each([
      ["reduced_movement"],
      ["severe_abdominal_pain"],
      ["fluid_leak"],
    ])("%s", (symptom) => {
      const result = evaluate([symptom]);
      expect(result.risk).toBe(RISK.HIGH);
      expect(result.emergency).toBe(false);
    });
  });

  describe("combination rules -> HIGH, not emergency", () => {
    test("severe_headache + blurred_vision", () => {
      const result = evaluate(["severe_headache", "blurred_vision"]);
      expect(result.risk).toBe(RISK.HIGH);
      expect(result.emergency).toBe(false);
      expect(result.reasons[0]).toMatch(/blood pressure/i);
    });

    test("severe_headache + swelling_face_hands", () => {
      const result = evaluate(["severe_headache", "swelling_face_hands"]);
      expect(result.risk).toBe(RISK.HIGH);
      expect(result.emergency).toBe(false);
    });
  });

  describe("single MODERATE signs", () => {
    test.each([
      ["fever"],
      ["severe_headache"],
      ["blurred_vision"],
      ["swelling_face_hands"],
    ])("%s alone -> MODERATE", (symptom) => {
      const result = evaluate([symptom]);
      expect(result.risk).toBe(RISK.MODERATE);
      expect(result.emergency).toBe(false);
    });
  });

  describe("single LOW signs", () => {
    test.each([
      ["swollen_feet"],
      ["mild_nausea"],
    ])("%s alone -> LOW", (symptom) => {
      const result = evaluate([symptom]);
      expect(result.risk).toBe(RISK.LOW);
      expect(result.emergency).toBe(false);
    });
  });

  test("3 or more moderate signs together escalate to HIGH", () => {
    // severe_headache, blurred_vision, fever = 3 of the 4 MODERATE_SIGNS
    const result = evaluate(["severe_headache", "blurred_vision", "fever"]);
    expect(result.risk).toBe(RISK.HIGH);
    expect(result.reasons).toContain(
      "Several warning signs together need prompt checking."
    );
  });

  test("2 moderate signs together stay at MODERATE (not 3+)", () => {
    const result = evaluate(["fever", "swelling_face_hands"]);
    expect(result.risk).toBe(RISK.MODERATE);
  });

  test("mixing a LOW sign with a HIGH sign keeps the HIGH result", () => {
    const result = evaluate(["swollen_feet", "heavy_bleeding"]);
    expect(result.risk).toBe(RISK.HIGH);
    expect(result.emergency).toBe(true);
  });

  test("reasons only include reasons for the final risk level", () => {
    // heavy_bleeding (HIGH/emergency) + swollen_feet (LOW)
    // should not include the swollen_feet reason
    const result = evaluate(["heavy_bleeding", "swollen_feet"]);
    const mentionsFeet = result.reasons.some((r) => /feet/i.test(r));
    expect(mentionsFeet).toBe(false);
  });

  test("unknown symptom keys are ignored, not an error", () => {
    expect(() => evaluate(["not_a_real_symptom"])).not.toThrow();
    const result = evaluate(["not_a_real_symptom"]);
    expect(result.risk).toBe(RISK.LOW);
  });
});