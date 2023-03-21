const fs = require("fs");
const path = require("path");

let totalSize,
    copiedSize = 0,
    time = 0;

function byte2mbyte(byte) {
    return Math.ceil(byte / Math.pow(1024, 2));
}

function copy(src, dest) {
    if (!fs.existsSync(src)) {
        throw new Error(`找不到${src}`);
    };
    if (fs.statSync(src).isDirectory()) {
        throw new Error(`${src}不是一个文件`);
    }
    let rs = fs.createReadStream(src),
        ws,
        stat = fs.statSync(src);
    if ( fs.existsSync(dest) && fs.statSync(dest).isDirectory() ) {
        let name = src.split(path.delimiter);
        name = name[name.length - 1];
        ws = fs.createWriteStream(path.resolve(dest, name));
    } else {
        ws = fs.createWriteStream(dest);
    }
    totalSize = byte2mbyte(stat.size);
    rs.on("data", chunk => {
        copiedSize += chunk.length;
        if (!ws.write(chunk)) {
            rs.pause();
        }
    });
    ws.on("drain", () => {
        rs.resume();
    });

    let timer = setInterval(() => {
        let size = byte2mbyte(copiedSize);
        time += 0.1;
        let speed = size / time;
        process.stdout.write(`${size}MB/${totalSize}MB, ${speed}MB/s\n`);
    }, 100);

    rs.on("end", () => {
        clearInterval(timer);
        timer = null;
        process.stdout.write("复制完成。\n");
        ws.end();
    });
}

//copy("./1.pkg", "./test/2.pkg");