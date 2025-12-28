import logger from "../utils/logger.js";

export function notFound(req, res) {
  return res.status(404).json({
    message: "Route not found",
    code: "NOT_FOUND"
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const code = err.code || (status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");

  logger.error({ err, status, path: req.path, method: req.method }, "Request failed");

  const response = {
    message,
    code
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
