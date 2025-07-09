const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(
      new BadRequestError("Name, avatar, email, and password are required")
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }

    const user = await User.create({
      name,
      avatar,
      email,
      password,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  const updates = {};

  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  if (Object.keys(updates).length === 0) {
    return next(new BadRequestError("No valid fields to update"));
  }

  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
