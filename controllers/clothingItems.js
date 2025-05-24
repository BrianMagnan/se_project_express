const ClothingItem = require("../models/clothingItems");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => {
      res.status(201).send({
        _id: item._id,
        name: item.name,
        weather: item.weather,
        imageUrl: item.imageUrl,
        owner: item.owner,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { id } = req.params;

  ClothingItem.findById(id)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("You can only delete your own items");
      }
      return ClothingItem.findByIdAndDelete(item._id);
    })
    .then(() => {
      res.send({ message: "Item deleted successfully" });
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const unlikeItem = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
