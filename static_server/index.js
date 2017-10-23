const http = require("http");
const path = require("path");
const fs = require("fs");
const url = require("url");
const MIME = require("./mime.json");

function startServer(dir, options) {
    let server = http.createServer((req, res) => {
        let pathname = url.parse(req.url).pathname;
        pathname = pathname.substring(1);
        send(dir, pathname, options, res);
    });
    server.listen(options.port);
    process.stdout.write("服务器在3000端口启动");
}

function send(dir, pathname, options, res) {
    let extname = path.extname(pathname),
        file = path.resolve(dir, pathname),
        index = options.index || "index.html";
    if (!pathname) {
        file = path.resolve(dir, index);
    } else {
        if (!extname && fs.existsSync(file) && fs.statSync(file).isDirectory()) {
            file = path.resolve(file, options.index);
        }
    }
    fs.readFile(file, "utf-8", (err, data) => {
        if (err) {
            res.writeHead(404, {
                "Content-Type": "text/html"
            });
            res.end("404 not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": MIME[extname] || ""
        });
        res.end(data);
    });
}

/* startServer("./static", {
    port: 3000
}); */