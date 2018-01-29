let fs = require("fs");
let http = require("http");
let querystring = require("querystring");

http.createServer((req, res) => {
    let url = req.url;
    let chunk = "";
    if (url === "/") {
        fs.readFile(`${__dirname}/post.html`, (err, data) => {
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
        .on("end", () => console.log(querystring.parse(chunk)))
}).listen(3000);