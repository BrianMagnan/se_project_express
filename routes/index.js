const express = require("express");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NotFoundError } = require("../utils/errors");
const { validateUser, validateLogin } = require("../middlewares/validation");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, validateUser, createUser);
router.post("/signin", authLimiter, validateLogin, login);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
