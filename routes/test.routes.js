const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "API 정상 작동 중!" });
});

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/chat", (req, res) => {
  const { number, name, dormitory, chat } = req.body;
  console.log("chat 요청", { number, name, dormitory, chat });
  res.json({ message: `${number} ${name} ${dormitory} ${chat}` });
});

module.exports = router;
