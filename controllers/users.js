const User = require("../models/user");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../utils/config");

const getUsers = (req, res, next) => {
  User.find({})
    .select("-password")
    .then((users) => res.send(users))
    .catch(next);
};

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  console.log("Creating user:", { name, email });

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
    console.log("User created:", user._id);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).send(userWithoutPassword);
  } catch (err) {
    console.error("Create user error:", err);
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    }
    next(err);
  }
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .select("-password")
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.send(user))
    .catch(next);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email });

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    console.log("Finding user by credentials...");
    const user = await User.findUserByCredentials(email, password);
    // console.log("User found:", user._id);

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    // console.log("Token generated");

    res.send({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    next(new UnauthorizedError("Incorrect email or password"));
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    res.send(user);
  } catch (err) {
    next(err);
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

  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .select("-password")
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
