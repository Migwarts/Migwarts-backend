const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

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
