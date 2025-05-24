/* eslint-disable no-console */
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
} = require("../constants/httpStatusCodes");

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, _next) => {
  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({
      message: "Not found",
    });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({
      message: "Invalid ID",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({
      message: err.message || "Invalid data provided",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(CONFLICT).send({
      message: "Email already exists",
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(UNAUTHORIZED).send({
      message: "Authentication required",
    });
  }

  if (err.name === "ForbiddenError") {
    return res.status(FORBIDDEN).send({
      message: "You don't have permission to perform this action",
    });
  }

  return res.status(INTERNAL_SERVER_ERROR).send({
    message: "An unexpected error occurred on the server",
  });
};

module.exports = handleError;
