// Demo villages used by the prototype. Each area maps to a health worker,
// or null if no health worker is assigned there (used to test the
// nearest-clinic fallback in src/engine/recipientRouter.js).
//
// A real deployment would replace this with real facility data and
// GPS-based distance, not a fixed lookup table.

const AREAS = {
  A: { name: "Village A", worker: "Health Worker Meena" },
  B: { name: "Village B", worker: "Health Worker Lakshmi" },
  C: { name: "Village C", worker: "Health Worker Priya" },
  D: { name: "Village D", worker: null },
};

// Used as the assigned recipient when an area has no health worker.
const CLINIC = "Primary Health Centre (nearest clinic)";

// A rough center point used to generate demo GPS coordinates near each area.
// Not a real location, just a starting point for fake coordinates.
const DEMO_BASE = { lat: 20.5937, lng: 78.9629 };

module.exports = { AREAS, CLINIC, DEMO_BASE };