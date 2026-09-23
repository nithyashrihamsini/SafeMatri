const express = require("express");
const {
  createCase,
  listCases,
  getCase,
  updateStatus,
} = require("../controllers/caseController.js");
const validate = require("../middleware/validate.js");
const { validateCreateCaseInput } = require("../validators/caseValidator.js");

const router = express.Router();
router.post("/", validate(validateCreateCaseInput), createCase);
router.get("/", listCases);
router.get("/:id", getCase);
router.patch("/:id/status", updateStatus);

module.exports = router;