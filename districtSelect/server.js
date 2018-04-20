const http = require("http");
const fs = require("fs");

function readFile(url, res) {
    url = url || "test.html";
    fs.readFile(url, (err, data) => {
        if (err) {
            res.end("Error");
            throw err;
        }
        res.writeHead(200);
        res.end(data);
    });
}

http.createServer((req, res) => {
    let url = req.url.substring(1);
    if (url.includes("favicon")) {
        res.end();
        return;
    }
    readFile(url, res);
}).listen(3000);
