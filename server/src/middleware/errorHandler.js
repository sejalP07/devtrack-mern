/**
 * Global Express error handler.
 * Must be registered after all routes (4-argument middleware).
 *
 * Returns a consistent JSON error envelope:
 * { success: false, message: "...", statusCode: ... }
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`[${req.method}] ${req.originalUrl} — ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
