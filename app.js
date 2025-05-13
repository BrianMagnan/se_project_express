/* eslint-disable no-console */

const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const { handleError } = require("./utils/errors/index");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: "6822750cb614cbf8e495207e",
  };
  next();
});
app.use("/users", userRouter);
app.use("/items", clothingItemsRouter);
app.use(handleError);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
