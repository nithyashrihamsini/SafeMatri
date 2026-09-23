const express = require("express");
const { getSmsLog } = require("../controllers/smsController.js");

const router = express.Router();
router.get("/", getSmsLog);

module.exports = router;