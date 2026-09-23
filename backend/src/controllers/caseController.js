const caseService = require("../services/caseService.js");
const { validateStatusInput } = require("../validators/caseValidator.js");
const { AppError } = require("../utils/errors.js");

// POST /api/cases
function createCase(req, res) {
  const caseItem = caseService.createCase(req.body);
  res.status(201).json(caseItem);
}

// GET /api/cases?status=&assignedTo=&area=
function listCases(req, res) {
  const { status, assignedTo, area } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (assignedTo) filters.assignedTo = assignedTo;
  if (area) filters.area = area;

  const queue = caseService.listQueue(filters);
  res.json(queue);
}

// GET /api/cases/:id
function getCase(req, res, next) {
  const caseItem = caseService.getCase(req.params.id);
  if (!caseItem) {
    return next(new AppError(`No case with id ${req.params.id}`, 404, "CASE_NOT_FOUND"));
  }
  res.json(caseItem);
}

// PATCH /api/cases/:id/status
function updateStatus(req, res, next) {
  try {
    validateStatusInput(req.body.status);
  } catch (err) {
    return next(err);
  }

  const updated = caseService.setStatus(req.params.id, req.body.status);
  if (!updated) {
    return next(new AppError(`No case with id ${req.params.id}`, 404, "CASE_NOT_FOUND"));
  }
  res.json(updated);
}

module.exports = { createCase, listCases, getCase, updateStatus };