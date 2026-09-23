const express = require("express");
const { postAssess } = require("../controllers/assessController.js");
const validate = require("../middleware/validate.js");
const { validateAssessInput } = require("../validators/assessValidator.js");

const router = express.Router();
router.post("/", validate(validateAssessInput), postAssess);

module.exports = router;