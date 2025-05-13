class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const handleError = (err, req, res, next) => {
  console.error(err);

  if (err.name === "DocumentNotFoundError") {
    return res.status(404).send({
      message: "Requested resource not found",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).send({
      message: "Invalid ID format",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).send({
      message: "Invalid data provided",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }

  return res.status(500).send({
    message: "An error occurred on the server",
  });
};

module.exports = {
  NotFoundError,
  BadRequestError,
  handleError,
};
