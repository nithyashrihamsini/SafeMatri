const caseService = require("../src/services/caseService.js");
const { STATUS } = require("../src/constants/enums.js");

caseService.seedDemoCases();

const queue = caseService.listQueue({ status: STATUS.NEW });
console.log(`\nPriority queue (${queue.length} new cases)\n`);
queue.forEach((c, i) => {
  const label = c.emergency ? "EMERGENCY" : c.risk;
  console.log(
    `${i + 1}. ${c.id}  [${label}]  waited ${Math.round(c.waitMinutes)} min  -> ${c.assignedTo}`
  );
});
console.log("");