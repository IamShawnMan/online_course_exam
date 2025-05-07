export const catchError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    status: "error",
    message,
    stack: err.stack,
  });
};

export class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    Error.captureStackTrace(this);
  }
}
