const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUser,
  validateUserUpdate,
} = require("../middlewares/validation");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
