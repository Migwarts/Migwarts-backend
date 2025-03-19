const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const app = express();
const server = require("http").createServer(app);
const port = 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.get("/api", (req, res) => {
  res.json({ message: "hello from the server!" });
});

server.listen(8080, () => {
  console.log("server is running on port 8080");
});
