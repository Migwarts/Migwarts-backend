const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
require("dotenv").config();
const mysql = require("mysql2");

app.use(cors());

// MySQL 연결
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

conn.connect((err) => {
  if (err) console.log("DB 연결 에러:", err);
  else console.log("Connected to the database!");
});

// 간단한 라우터
app.get("/", (req, res) => {
  res.send("Welcome to the server! Use /api to get data.");
});

app.get("/api", (req, res) => {
  res.send({ message: "hello from the server!" });
});

app.use((req, res) => {
  res.status(404).send("404 Not Found: The requested resource does not exist.");
});

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// 연결 내보내기 (필요하면)
module.exports = conn;
