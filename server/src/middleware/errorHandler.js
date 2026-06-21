export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ZodError") {
    res.status(400).json({ message: error.errors[0]?.message || "Invalid request" });
    return;
  }

  const status = error.status || 500;
  const message = status === 500 ? "Something went wrong" : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({ message });
}
