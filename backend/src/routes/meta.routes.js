const express = require("express");
const { getMeta } = require("../controllers/metaController.js");

const router = express.Router();
router.get("/", getMeta);

module.exports = router;