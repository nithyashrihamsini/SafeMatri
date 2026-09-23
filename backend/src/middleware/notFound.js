// Runs when no route matched the request at all.
function notFound(req, res) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: `No route: ${req.method} ${req.originalUrl}` },
  });
}

module.exports = notFound;