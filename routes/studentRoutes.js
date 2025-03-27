// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { Student } = require("../models/studentModel");

router.post("/students", async (req, res) => {
  const { number, name, dormitory } = req.body;

  try {
    const newStudent = await Student.create({
      number,
      name,
      dormitory,
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "학생 저장 실패", details: error.message });
  }
});

module.exports = router;
