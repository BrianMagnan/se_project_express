/* eslint-disable no-console */

const handleError = (err, req, res, next) => {
  console.error(err);

  const NOT_FOUND = 404;
  const BAD_REQUEST = 400;
  const SERVER_ERROR = 500;

  if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND).send({
      message: "Requested resource not found",
    });
  }

  if (err.name === "CastError") {
    res.status(BAD_REQUEST).send({
      message: "Invalid ID format",
    });
  }

  if (err.name === "ValidationError") {
    res.status(BAD_REQUEST).send({
      message: "Invalid data provided",
    });
  }

  if (err.statusCode) {
    res.status(err.statusCode).send({
      message: err.message,
    });
  }

  res.status(SERVER_ERROR).send({
    message: "An error occurred on the server",
  });
  next();
};

module.exports = handleError;
