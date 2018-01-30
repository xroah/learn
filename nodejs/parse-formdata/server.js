let fs = require("fs");
let http = require("http");
let qs = require("querystring");

http.createServer((req, res) => {
    let url = req.url;
    let chunk = {
        data: [],
        length: 0
    };
    let contentType = req.headers["content-type"];
    if (url === "/") {
        fs.readFile(`${__dirname}/index.html`, (err, data) => {
            if (err) throw err;
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        });
    } else if(url === "/post") {
        res.end("Hello");
    } else {
        res.writeHead(404);
        res.end("error");
    }
    req.on("data", c => {
        chunk.data.push(c);
        chunk.length += c.length;
    })
        .on("end", () => {
            chunk = Buffer.concat(chunk.data, chunk.length);
            splitFormData(chunk, contentType);
        })
}).listen(3000);

function getBoundary(ct) {
    let i;
    if (ct) {
        i = ct.indexOf("boundary");
        if (i >= 0) {
            ct = ct.substring(i);
        }
        i = ct.split("=")[1];
    }
    return `--${i}`;
}

function splitFormData(chunk, contentType) {
    if (chunk.length) {
        let boundary = getBoundary(contentType);
        let len = boundary.length;
        let data = [];
        let start = len + 1;
        let end;
        while((end = chunk.indexOf(boundary, start)) > -1) {
            let sub = chunk.slice(start + 1, end);
            data.push(sub);
            start = end + len + 1;
        }
       parseFormData(data);
    }
}

function parseFormData(data) {
    let result = {};
    let len = data.length;
    let split = "\r\n\r\n";
    if (len) {
        let reg = /(\r\n)+/g;
        for (let i = 0; i < len; i++) {
            let item = data[i];
            if (item.indexOf("Content-Type") > -1) {
                let index = item.indexOf(split) + split.length;
                let head = item.slice(0, index);
                let file = item.slice(index);
                saveFile(head, file);
            }
         }
    }
}

function saveFile(head, file) {
    fs.writeFile(`${__dirname}/test.jpg`, file, err => {
        if (err) {
            throw err;
        }
    })
}