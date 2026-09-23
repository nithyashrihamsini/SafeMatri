const app = require("./app.js");
const config = require("./config/index.js");
const caseService = require("./services/caseService.js");

// Start with demo data already loaded, so the dashboard isn't empty
// the first time the frontend loads.
caseService.seedDemoCases();

app.listen(config.port, () => {
  console.log(`SafeMatri backend running on http://localhost:${config.port}`);
});