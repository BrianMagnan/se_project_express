/* eslint-disable no-console */

const handleError = (err, req, res) => {
  console.error(err);

  const NOT_FOUND = 404;
  const BAD_REQUEST = 400;
  const SERVER_ERROR = 500;

  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({
      message: "Requested resource not found",
    });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({
      message: "Invalid ID format",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({
      message: "Invalid data provided",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }

  return res.status(SERVER_ERROR).send({
    message: "An error occurred on the server",
  });
};

module.exports = handleError;
