const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const isServerError = status >= 500;
  const exposeDetails = err.expose || !isServerError || process.env.NODE_ENV !== "production";

  res.status(status).json({
    message: exposeDetails ? err.message : "Internal server error",
  });
};

module.exports = errorHandler;
