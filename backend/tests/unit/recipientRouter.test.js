const { route } = require("../../src/engine/recipientRouter.js");

describe("recipientRouter.route", () => {
  test("Village A has a health worker assigned", () => {
    const result = route("A");
    expect(result.assignedTo).toBe("Health Worker Meena");
    expect(result.fallback).toBe(false);
  });

  test("Village B has a health worker assigned", () => {
    const result = route("B");
    expect(result.assignedTo).toBe("Health Worker Lakshmi");
    expect(result.fallback).toBe(false);
  });

  test("Village C has a health worker assigned", () => {
    const result = route("C");
    expect(result.assignedTo).toBe("Health Worker Priya");
    expect(result.fallback).toBe(false);
  });

  test("Village D has no health worker, so it falls back to the clinic", () => {
    const result = route("D");
    expect(result.assignedTo).toBe("Primary Health Centre (nearest clinic)");
    expect(result.fallback).toBe(true);
  });

  test("an unknown area key throws an error", () => {
    expect(() => route("Z")).toThrow("Unknown area: Z");
  });

  test("an empty string throws an error", () => {
    expect(() => route("")).toThrow();
  });
});