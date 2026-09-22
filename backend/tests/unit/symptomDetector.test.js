const { detect } = require("../../src/engine/symptomDetector.js");

describe("symptomDetector.detect", () => {
  test("empty string returns []", () => {
    expect(detect("")).toEqual([]);
  });

  test("undefined/null returns [] instead of throwing", () => {
    expect(() => detect(undefined)).not.toThrow();
    expect(detect(undefined)).toEqual([]);
    expect(() => detect(null)).not.toThrow();
    expect(detect(null)).toEqual([]);
  });

  test("text with no matching phrases returns []", () => {
    expect(detect("I feel completely fine today")).toEqual([]);
  });

  test("detects a single clear symptom", () => {
    expect(detect("there is a lot of bleeding since morning")).toEqual([
      "heavy_bleeding",
    ]);
  });

  test("detects multiple symptoms in one sentence", () => {
    const result = detect(
      "my head is paining a lot and my eyes are blurry"
    );
    expect(result).toContain("severe_headache");
    expect(result).toContain("blurred_vision");
    expect(result.length).toBe(2);
  });

  test("detects reduced baby movement phrased naturally", () => {
    const result = detect("the baby is not kicking like before");
    expect(result).toContain("reduced_movement");
  });

  test("detects swelling of face/hands vs swelling of feet separately", () => {
    expect(detect("my face and hands are puffy")).toEqual([
      "swelling_face_hands",
    ]);
    expect(detect("my feet are swollen")).toEqual(["swollen_feet"]);
  });

  test("detects fluid leak phrased naturally", () => {
    expect(detect("water is leaking since last night")).toContain(
      "fluid_leak"
    );
  });

  test("detects fever/shivering", () => {
    expect(detect("fever and shivering for two days")).toContain("fever");
  });

  test("detects severe abdominal pain phrased naturally", () => {
    expect(detect("severe pain in my stomach")).toContain(
      "severe_abdominal_pain"
    );
  });

  test("is case-insensitive", () => {
    expect(detect("THERE IS A LOT OF BLEEDING")).toContain("heavy_bleeding");
  });

  test("does not crash on unrelated long text", () => {
    const longText =
      "I went to the market today and bought vegetables and rice, then walked home.";
    expect(() => detect(longText)).not.toThrow();
    expect(detect(longText)).toEqual([]);
  });
});