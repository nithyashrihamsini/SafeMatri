/**
 * validate(validatorFn) -> Express middleware.
 * validatorFn(req.body) should throw an AppError if invalid.
 * Usage: router.post("/", validate(validateCreateCaseInput), controller.create);
 */
function validate(validatorFn) {
  return (req, res, next) => {
    try {
      validatorFn(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;