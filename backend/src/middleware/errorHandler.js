export function notFound(req, res) {
  return res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  const response = { message };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(status).json(response);
}
