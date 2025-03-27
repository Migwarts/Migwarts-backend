const Student = require("../models/studentModel");

exports.createStudent = async (req, res) => {
  try {
    const { number, name } = req.body;
    const newStudent = await Student.create({ number, name });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  const students = await Student.findAll();
  res.json(students);
};
