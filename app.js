// 📦 기본 모듈 불러오기
const express = require("express");
const bodyParser = require("body-parser");

// 🔗 Sequelize (DB ORM) 연결 파일
const sequelize = require("./database");

// 🧭 학생 라우터 import
const studentRoutes = require("./routes/studentRoutes");

const app = express(); // 서버 앱 생성

// ✅ JSON 형식의 body 파싱을 위한 미들웨어
app.use(bodyParser.json());

// ✅ 라우터 등록 (모든 /api 경로는 studentRoutes에서 처리)
app.use("/api", studentRoutes);
 

// 🔌 DB 연결 + 서버 실행
sequelize.sync().then(() => {
  console.log("DB 연결 성공"); // 📣 Sequelize가 DB랑 연결 완료!

  // 🚀 서버 실행
  app.listen(3000, () => {
    console.log("서버 실행 중: http://localhost:3000");
  });
});