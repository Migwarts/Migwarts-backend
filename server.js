// 📦 필수 모듈 import (서버, DB, 환경변수 등)
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

// 🛣️ 라우터 파일 import (기능별 API 경로 모음)
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");
const chatBotRouter = require("./routes/chatbot.routes");

// 🚀 Express 앱 생성 + 포트 설정
const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// 🧩 공통 미들웨어 등록 (JSON 파싱, CORS 설정 등)
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://13.124.135.183"],
    credentials: true,
  })
);

// 💾 MySQL 커넥션 풀 생성 (DB랑 효율적으로 연결하기 위한 통로들 미리 만들어두기)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 3306, // 📌 실제 DB 포트
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🗂️ 만든 커넥션 풀을 전체 앱에서 사용할 수 있게 등록
app.set("db", pool);

// 🔁 요청마다 DB 연결(pool)을 req 객체에 주입 (라우터에서도 req.pool로 접근 가능)
app.use((req, res, next) => {
  req.pool = app.get("db");
  next();
});

// 🧭 라우터 등록 (요청 경로에 따라 기능별로 분기)
app.use("/api/post", userRouter); // ✍️ 유저 관련 API
app.use("/api", chatRouter); // 💬 채팅 관련 API
app.use("/api/chatbot", chatBotRouter)

// 🧪 테스트용 라우터 (서버가 살아있는지 확인용)
app.get("/api", (req, res) => {
  console.log("📡 GET /api 요청 받음");
  res.send({ message: "API 정상 작동 중!" });
});

// 🔊 서버 실행 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 (포트 ${PORT})`);
});