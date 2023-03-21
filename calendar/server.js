let http = require("http");
let fs = require("fs");

http.createServer((req, res) => {
    let url = req.url;
    if (req.method.toLowerCase() === "post") {
        let ret = "";
        req.on("data", chunk => {
            ret += chunk;
        });
        req.on("end", () => {
            fs.writeFile(`${__dirname}/result.txt`, ret, err => {
                if (err) throw err;
            });
            res.end("success");
        });
        return;
    }
    if (!url.endsWith("ico")) {
        if (!url.endsWith(".txt")) {
            res.setHeader("content-type", "text/html;charset=Big5;");
            url = "index.html";
        } else {
            res.setHeader("content-type", "text/plain;charset=Big5;");
        }
        readFile(url).then(data => {
            res.end(data);
        });
    }
}).listen(3000);

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/${path}`, (err, data) => {
            if (err) {
                reject(err);
                throw err;
            } else {
                resolve(data);
            }
        })
    });
}
