/**
 * AppError - a known, expected error (bad input, not found, etc.),
 * as opposed to a genuine bug. Thrown by validators and services,
 * caught by errorHandler middleware (B9), and turned into a clean
 * { error: { code, message } } JSON response.
 */
class AppError extends Error {
  /**
   * @param {string} message - human-readable explanation
   * @param {number} statusCode - HTTP status to respond with (default 400)
   * @param {string} code - short machine-readable code, e.g. "MISSING_CONSENT"
   */
  constructor(message, statusCode = 400, code = "BAD_REQUEST") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

module.exports = { AppError };