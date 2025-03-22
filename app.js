const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const db = require("./database/db");
const mysql = require("mysql2");
require("dotenv").config();

// const conn = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT, // 각자 다른 포트 써도 됨
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

app.use(cors());

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
  console.log("server is running on http://localhost:8080");
});
