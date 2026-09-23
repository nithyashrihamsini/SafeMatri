const express = require("express");
const { fastForward, resetDemo } = require("../controllers/demoController.js");

const router = express.Router();
router.post("/fast-forward", fastForward);
router.post("/reset", resetDemo);

module.exports = router;