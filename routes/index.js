const express = require("express");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const router = express.Router();

// User routes
router.use("/users", userRouter);

// Clothing items routes
router.use("/items", clothingItemsRouter);

// 404 handler for unknown routes
router.use((req, res) => {
  const NOT_FOUND = 404;
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
