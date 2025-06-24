const express = require("express");
const router = express.Router();
const { getDormChat, postChat } = require("../controllers/chat.controller");

router.get("/get/chat/:dormitory", getDormChat);
router.post("/post/chat/:id", postChat);

module.exports = router;
