const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

router.post("/users", createUser);
router.delete("/user/:id", deleteUser);
router.put("/user/:id", updateUser);

module.exports = router;