const express = require("express");
const router = express.Router();
const { Student } = require("../models/studentModel");

// 학생 생성 API
router.post("/post/student", async (req, res) => {
  const { number, name, dormitory } = req.body;

  try {
    const newStudent = await Student.create({
      number,
      name,
      dormitory,
      chat: [], // 처음엔 빈 배열
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "학생 저장 실패", details: error.message });
  }
});

// 기숙사별 학생 목록 조회 API
router.get("/get/dormitory/:dormitory", async (req, res) => {
  const { dormitory } = req.params;

  try {
    const students = await Student.findAll({
      where: { dormitory },
      attributes: ["number", "name"],
    });
    res.json(students);
  } catch (error) {
    res
      .status(500)
      .json({ error: "채팅 데이터 조회 실패", details: error.message });
  }
});

// 채팅 추가 API (학생 ID 기반)
router.patch("/patch/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body; // 프론트에서 보낸 채팅 메시지

  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "학생을 찾을 수 없음" });
    }

    // 기존 채팅 데이터 가져와서 새 메시지 추가
    const updatedChat = [...student.chat, message];
    student.chat = updatedChat; // chat 필드 업데이트
    await student.save(); // DB에 저장

    res.json({ message: "채팅 추가 완료", chat: student.chat });
  } catch (error) {
    res.status(500).json({ error: "채팅 추가 실패", details: error.message });
  }
});

module.exports = router;
