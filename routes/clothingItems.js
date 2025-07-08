const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", auth, validateClothingItem, createItem);

router.delete("/:id", auth, validateId, deleteItem);

router.put("/:id/likes", auth, validateId, likeItem);

router.delete("/:id/likes", auth, validateId, unlikeItem);

module.exports = router;
