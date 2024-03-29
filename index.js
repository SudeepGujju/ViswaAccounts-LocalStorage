const express = require('express');
const http = require('http');
const path = require('path');

const port = process.env.PORT || 8000;

const app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "/dist/giftshop")));

app.get("/*", function (req, res, next) {
    return res.sendFile(
        path.join(__dirname, "/dist/giftshop/index.html")
    );
});

app.use('**', function (req, res) {
    res.status(404);
    res.send('Invalid request method/url');
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
