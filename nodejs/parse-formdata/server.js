let fs = require("fs");
let http = require("http");
let crypto = require("crypto");
let path = require("path");
const EXT = require("./ext.json");

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
            console.log(chunk.data)
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

/*
   一个不含二进制文件的FormData格式如下（其中的分号nodejs中会变成逗号）
   ------WebKitFormBoundary2UQUOBLuyuXKBJYP
    Content-Disposition: form-data; name="userName"

    test
    */
/*
 含有二进制文件的FormData格式如下
 ------WebKitFormBoundary2UQUOBLuyuXKBJYP
 Content-Disposition: form-data; name="userName"

 test
 ------WebKitFormBoundary2UQUOBLuyuXKBJYP
 Content-Disposition: form-data; name="file"; filename="full-screen.svg"
 Content-Type: image/svg+xml


 ------WebKitFormBoundary2UQUOBLuyuXKBJYP--*/

/*
* nodejs post请求收到的数据都是buffer类型,
* 根据以上FormData格式去解析数据
* */

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
    let result = {
        files: {}
    };
    let len = data.length;
    let split = "\r\n\r\n";
    if (len) {
        for (let i = 0; i < len; i++) {
            let item = data[i];
            if (item.indexOf("Content-Type") > -1) {
                let index = item.indexOf(split) + split.length;
                let head = item.slice(0, index);
                let file = item.slice(index);
                let parsed = parseFormName(head, true);
                let key = parsed.key;
                parsed[key].data = file;
                parsed[key].size = file.length;
                result.files[key] = parsed[key];
            } else {
                item = item.toString().split(";");
                Object.assign(result, parseFormName(item))
               // console.log(item.toString())
            }
         }
         console.log(result)
        saveFile(result.files);
    }
}

function parseFormName(buf, isFile) {
    let result = {};
    let str = buf.toString();
    str = str.replace(/Content-Disposition: form-data[;,]/, "");
    let reg = /(?:\r\n)+/;
    let quotReg = /['"]+/g;
    let arr = str.split(reg);
    arr.pop();

    if (isFile) {
        let tmp = arr[0].split(";");
        //可以解析出来为'"name"'形式,替换掉多余的引号
        let key = tmp[0].split("=")[1].replace(quotReg, "");
        let contentType = arr[1].split(":")[1].trim();
        result[key] = {
            filename: tmp[1].split("=")[1].replace(quotReg, ""),
            contentType
        };
        //该文件属性的索引
        result.key = key;
    } else {
        let key = arr[0].split("=")[1].replace(quotReg, "");
        result[key] = arr[1];
    }
    return result
}

function saveFile(filesObj) {
    for (let key in filesObj) {
        let file = filesObj[key];
        let name = Date.now() + file.filename + (Math.random() * 99999 >>> 0);
        let md5 = crypto.createHash("md5");
        let ext = EXT[file.contentType] || path.extname(file.filename);
        md5.update(name);
        name = md5.digest("hex");
        console.log(`${__dirname}/upload/${name}${ext}`)
        fs.writeFile(`${__dirname}/upload/${name}${ext}`, file.data, err => {
            if (err) {
                throw err;
            }
        });
    }
}
