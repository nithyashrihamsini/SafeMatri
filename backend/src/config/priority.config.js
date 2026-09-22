// Settings for the priority queue.
// priority = weight for the risk level + (minutes waited * agingPerMinute)
// Emergency cases always use emergencyWeight, which stays above every other score.

const PRIORITY_CONFIG = {
  weights: {
    LOW: 10,
    MODERATE: 50,
    HIGH: 100,
  },
  emergencyWeight: 1000,
  agingPerMinute: 0.05,
};

module.exports = PRIORITY_CONFIG;