const User = require("../models/user");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    next(new BadRequestError("Name and avatar are required"));
    return;
  }

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))

    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
