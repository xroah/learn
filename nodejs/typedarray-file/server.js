let fs = require("fs");
let http = require("http");

http.createServer((req, res) => {
    let url = req.url;
    let chunk = "";
    console.log(req.method);
    if (url === "/") {
        fs.readFile(`${__dirname}/filereader-hex.html`, (err, data) => {
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
    req.on("data", c => chunk += c)
        .on("end", () => {
            if(chunk) {
                let hex = JSON.parse(chunk).file;
                fs.writeFile(`${__dirname}/test.jpg`, Buffer.from(hex), err => {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
}).listen(3000);
