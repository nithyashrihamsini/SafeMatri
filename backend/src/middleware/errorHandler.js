const { AppError } = require("../utils/errors.js");

// Must be registered LAST, after all routes. Express recognizes it as
// an error handler because it takes 4 arguments.
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  // Unexpected error — log it for us, don't leak internals to the caller.
  console.error("Unexpected error:", err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
  });
}

module.exports = errorHandler;