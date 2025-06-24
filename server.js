// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://13.124.135.183"],
    credentials: true,
  })
);

// ✅ 커넥션 풀 생성 및 등록
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.set("db", pool);

// ✅ 모든 요청에 req.pool 설정
app.use((req, res, next) => {
  req.pool = app.get("db");
  next();
});

// ✅ 라우터 등록
app.use("/api/post", userRouter);
app.use("/api", chatRouter);

app.get("/api", (req, res) => {
  console.log("📡 GET /api 요청 받음");
  res.send({ message: "API 정상 작동 중!" });
});

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 (포트 ${PORT})`);
});
