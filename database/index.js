const { Sequelize } = require("sequelize");
require("dotenv").config(); // .env 파일을 로드합니다.

const sequelize = new Sequelize(
  process.env.DB_DATABASE, // DB 이름
  process.env.DB_USER, // DB 사용자
  process.env.DB_PASSWORD, // DB 비밀번호
  {
    host: process.env.DB_HOST, // DB 호스트
    dialect: "mysql", // DB 종류
    port: process.env.DB_PORT, // DB 포트
  }
);

module.exports = sequelize;
