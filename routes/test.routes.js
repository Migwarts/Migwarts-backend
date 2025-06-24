// 🧪 테스트용 라우터
const express = require("express");
const router = express.Router(); // 라우터 객체 생성

// ✅ 기본 테스트: 서버 작동 확인
// GET /api/
// ex) http://localhost:3001/api/
router.get("/", (req, res) => {
  res.send({ message: "API 정상 작동 중!" });
});

// ✅ ping 테스트: 빠르게 응답 확인할 때 쓰임
// GET /api/ping → pong
router.get("/ping", (req, res) => {
  res.send("pong");
});

// ✅ POST 테스트: 프론트에서 데이터 전송되는지 확인
// POST /api/chat
router.post("/chat", (req, res) => {
  const { number, name, dormitory, chat } = req.body;

  // 서버 콘솔에 데이터 출력 (개발자 확인용)
  console.log("chat 요청", { number, name, dormitory, chat });

  // 받은 데이터 그대로 응답에 담아줌 (테스트용)
  res.json({ message: `${number} ${name} ${dormitory} ${chat}` });
});

// 📤 외부에서 사용할 수 있게 라우터 내보내기
module.exports = router;