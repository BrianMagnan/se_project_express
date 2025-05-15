/* eslint-disable no-console */
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCodes");

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, _next) => {
  console.error(err);

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

  return res.status(INTERNAL_SERVER_ERROR).send({
    message: "An error occurred on the server",
  });
};

module.exports = handleError;
