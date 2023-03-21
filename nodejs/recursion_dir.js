const fs = require("fs");
const path = require("path");

const spaces = [];

function readDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    let files = fs.readdirSync(dir),
        i = 0,
        len = files.length,
        tmp;
    tmp = dir.split("/");
    tmp = tmp[tmp.length - 1];
    process.stdout.write(spaces.join("") + tmp + "\n");
    spaces.push("  ");
    for (; i < len; i++) {
        let _path = dir + "/" + files[i];
        if (fs.statSync(_path).isDirectory()) {
            readDir(_path);
        } else {
            process.stdout.write(spaces.join("") + files[i] + "\n");
        }
    }
    spaces.pop();
} 

readDir(".");

