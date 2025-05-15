const express = require("express");
const { NOT_FOUND } = require("../utils/constants/httpStatusCodes");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

const router = express.Router();

// User routes
router.use("/users", userRouter);

// Clothing items routes
router.use("/items", clothingItemsRouter);

router.post("/signin", login);
router.post("/signup", createUser);

// 404 handler for unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
