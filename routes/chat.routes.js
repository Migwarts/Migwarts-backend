const express = require("express");
const router = express.Router(); // 라우터 객체 생성

// 📦 컨트롤러에서 함수 가져오기 (채팅 기능 담당)
const { getDormChat, postChat } = require("../controllers/chat.controller");

// ✅ [GET] 기숙사별 채팅 목록 불러오기
router.get("/get/chat/:dormitory", getDormChat);

// ✅ [POST] 특정 유저의 채팅 추가
// ex) POST /api/post/chat/3
router.post("/post/chat/:id", postChat);

// 📤 라우터 내보내기
module.exports = router;