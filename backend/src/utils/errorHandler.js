// This is your new central error handler
const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  res.status(statusCode).json({
    success: false,
    error: message,
    // Only send the full error stack in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// This is a wrapper for your async controllers
// It automatically catches errors and passes them to your errorHandler
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default errorHandler;
