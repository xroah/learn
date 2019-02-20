const fs = require("fs");
const path = require("path");
const https = require("https");
const EventEmitter = require("events");

let em = new EventEmitter();

let req = https.request({
    hostname: "cn.bing.com",
    path: "/HPImageArchive.aspx?format=js&idx=0&n=1"
}, res => {
    let str = "";
    res.on("end", function () {
        em.emit("get.info.done", JSON.parse(str));
    });

    res.on("data", chunk => {
        str += chunk;
    });
});

req.on("error", () => {
    console.error("error");
});

req.end();

em.on("get.info.done", handleBaseInfo);

function mkdir(p) {
    p = path.normalize(p);
    if (fs.existsSync(p)) return;
    let pArr = p.split(path.sep);
    let _p = [p];
    while (pArr.length > 1) {
        pArr.pop();
        _p.unshift(pArr.join(path.sep));
    }
    for (let i = 0, l = _p.length; i < l; i++) {
        let tmp = _p[i];
        if (!fs.existsSync(tmp)) {
            fs.mkdirSync(tmp);
        }
    }
}

function writeFile(buffer, img) {
    let ext = path.extname(img.url);
    let name = img.copyright;
    let date = new Date();
    let year = date.getFullYear();
    let mon = date.getMonth() + 1;
    let p = `./pictures/${year}/${mon}`;
    let day = date.getDate();
    mkdir(p);
    fs.writeFileSync(`${p}/${year}-${mon}-${day} ${name.replace(/\//g, '、')}${ext}`, buffer);
    process.stdout.write("下载成功!\n");
}

function handleBaseInfo(data) {
    let img = data.images[0];
    let url = img.url;
    let hostname = "cn.bing.com";
    let _path;
    if (!url.startsWith("https:")) {
        _path = url;
    } else {
        url = new URL(url);
        _path = url.pathname
    }
    let req = https.request({
        hostname,
        path: _path
    }, res => {
        let buf = Buffer.alloc(0);
        res.on("end", () => {
            writeFile(buf, img);
        });

        res.on("data", chunk => {
            buf = Buffer.concat([buf, chunk], chunk.length + buf.length);
        });
    });
    req.end();
}