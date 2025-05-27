const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // ✅ 'mysql2/promise' 사용
require("dotenv").config();

const PORT = process.env.SERVER_PORT || 3001;

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
app.post("/api/post/users", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const { number, name } = req.body;

    console.log("📩 받은 데이터:", { number, name }); // 👈 여기 추가

    if (!number || !name) {
      return res.status(400).json({ message: "학번과 이름을 입력하세요." });
    }

    const result = await conn.query(
      "INSERT INTO users (number, name) VALUES (?, ?)",
      [number, name]
    );
    conn.release();

    const insertId = result[0]?.insertId;

    res.status(201).json({ message: "학생 저장 성공!", id: insertId });
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

app.get("/api/get/chat/:dormitory", async (req, res) => {
  let conn;
  const dormitory = req.params.dormitory;

  try {
    conn = await pool.getConnection();

    const [rows] = await conn.query(
      `
      SELECT users.id, users.number, users.name, chat.chat
      FROM users
      JOIN chat ON users.id = chat.id
      WHERE chat.dormitory = ?
    `,
      [dormitory]
    );

    if (rows.length > 0) {
      const parsedRows = rows.map((row) => ({
        ...row,
        chat: typeof row.chat === "string" ? JSON.parse(row.chat) : row.chat,
      }));

      res.status(200).json({
        message: "채팅 + 유저 정보 불러오기 성공!",
        data: parsedRows,
      });
    } else {
      res.status(200).json({
        message: "해당 기숙사의 채팅 데이터가 없습니다.",
        data: [],
      });
    }
  } catch (error) {
    console.error("❌ 채팅 데이터 불러오기 실패:", error);
    res.status(500).json({
      message: "서버 오류 발생",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/api/post/chat/:id", async (req, res) => {
  let conn;
  const id = req.params.id;
  try {
    conn = await pool.getConnection();

    let { dormitory, newChat } = req.body;

    if (!id || !dormitory || !newChat) {
      return res.status(400).json({ message: "모든 항목을 입력해주세요." });
    }

    const [rows] = await conn.query("SELECT chat FROM chat WHERE id = ?", [id]);

    if (rows.length > 0) {
      let chatArray = rows[0].chat;
      chatArray.push(newChat);
      const newChatJson = JSON.stringify(chatArray);
      await conn.query("UPDATE chat SET chat = ? WHERE id = ?", [
        newChatJson,
        id,
      ]);
    } else {
      const newChatJson = JSON.stringify([newChat]);
      await conn.query(
        "INSERT INTO chat (id, dormitory, chat) VALUES (?, ?, ?)",
        [id, dormitory, newChatJson]
      );
    }

    res.status(201).json({ message: "채팅 저장 완료!" });
  } catch (error) {
    console.error("❌ 채팅 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/api/chat", (req, res) => {
  console.log("chat 요청");
  res.send({ message: `${number} ${name} ${dormitory} ${chat}` });

  const { number, name, dormitory, chat } = req.body;
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 (포트 ${PORT})`);
});
