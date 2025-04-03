const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // ✅ 'mysql2/promise' 사용
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ MySQL 연결 (createPool 사용)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔹 학생 추가 API (POST /api/post/student)
app.post("/api/post/student", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { number, name } = req.body;

    console.log("📩 받은 데이터:", { number, name }); // 👈 여기 추가

    if (!number || !name) {
      return res.status(400).json({ message: "학번과 이름을 입력하세요." });
    }

    await conn.query("INSERT INTO students (number, name) VALUES (?, ?)", [
      number,
      name,
    ]);
    conn.release();

    res.status(201).json({ message: "학생 저장 성공!" });
  } catch (error) {
    if (conn) conn.release();
    console.error("❌ 학생 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  }
});

app.get("/api", (req, res) => {
  console.log("📡 GET /api 요청 받음"); // 이거 로그 찍어보기!
  res.send({ message: "API 정상 작동 중!" });
});

// ✅ 서버 실행
app.listen(5002, () => {
  console.log("🚀 서버 실행 중 (포트 5002)");
});
