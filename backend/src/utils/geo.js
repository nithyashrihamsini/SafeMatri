const { DEMO_BASE } = require("../data/areas.js");

/**
 * mapsLink({ lat, lng }) -> a Google Maps URL for that point.
 */
function mapsLink(location) {
  return `https://maps.google.com/?q=${location.lat},${location.lng}`;
}

// Small per-area offsets so each demo village's fake coordinates
// cluster in a different spot around DEMO_BASE, instead of overlapping.
const AREA_OFFSETS = {
  A: [0.02, 0.01],
  B: [-0.03, 0.02],
  C: [0.01, -0.04],
  D: [-0.05, -0.03],
};

/**
 * demoLocation(areaKey) -> a fake but plausible-looking { lat, lng, demo: true }
 * near DEMO_BASE, shifted by that area's offset plus a small random jitter.
 * Used when a woman doesn't share her real device location.
 */
function demoLocation(areaKey) {
  const [dLat, dLng] = AREA_OFFSETS[areaKey] || [0, 0];
  const jitter = () => (Math.random() - 0.5) * 0.01;

  return {
    lat: +(DEMO_BASE.lat + dLat + jitter()).toFixed(5),
    lng: +(DEMO_BASE.lng + dLng + jitter()).toFixed(5),
    demo: true,
  };
}

module.exports = { mapsLink, demoLocation };