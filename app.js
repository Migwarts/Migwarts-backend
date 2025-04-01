const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./database");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/api", studentRoutes);

sequelize.sync().then(() => {
  console.log("DB 연결 성공");
  app.listen(3000, () => {
    console.log("서버 실행 중: http://localhost:3000");
  });
});
