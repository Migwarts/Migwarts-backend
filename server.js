const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.get('/api', (req, res) => {
    res.json({ message: "hello from the server!" });
});

server.listen(8080, () => {
    console.log('server is running on port 8080');
});