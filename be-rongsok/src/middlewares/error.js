const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  res.status(status).json({
    status: 'error',
    message,
    errors
  });
};

module.exports = { errorHandler };
