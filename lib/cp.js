const fs = require("fs");
const path = require("path");

//if a file size is more than 10MB, use stream,
// / otherwise read the file into memory
const MAX_SIZE = 10 * 1024 * 1024; //10MB

const DEFAULT_OPTIONS = {
    replace: true
};

function copyFile(src, dest, options, callback) {
    let dir, fileName;
    dest = path.normalize(dest);
    //if dest ends with slash, regard as directory
    if (dest.endsWith(path.sep)) {
        dir = dest;
        fileName = path.parse(src).base;
    } else {
        let tmp = path.parse(dest);
        dir = tmp.dir;
        fileName = tmp.base;
    }
    fileName = path.join(dir, fileName);

    function _copyFile(err) {
        if (err) return callback(err);
        let rs = fs.createReadStream(src);
        let ws = fs.createWriteStream(fileName);
        rs.pipe(ws);
        rs.once("end", callback);
    }
    fs.access(fileName, err => {
        if (err || options.replace) return mkdir(dir, _copyFile);
        callback(null);
    });
}

function mkdir(dir, callback) {
    let dirs = [dir];
    let _dir = dir;
    while (_dir = path.parse(_dir).dir) {
        dirs.push(_dir);
    }
    let len = dirs.length;

    function _mkdir() {
        fs.mkdir(dirs[len - 1], err => {
            if (err) {
                if (err.code !== "EEXIST") {
                    return callback(err);
                }
            }
            if (--len === 0) {
                return callback();
            }
            _mkdir();
        });
    }
    _mkdir();
}

function copyDir(src, dest, options, callback) {
    let fileNum = 0;

    function readdir(dir, callback) {
        fs.readdir(dir, (err, files) => {
            if (err) return callback(err);
            let cb = function (err) {
                if (err) {
                    return callback(err);
                }
                if (--fileNum <= 0) {
                    callback();
                }
            }
            for (let file of files) {
                let fileName = path.join(dir, file);
                fs.stat(fileName, (err, stat) => {
                    if (err) return callback(err);
                    if (stat.isFile()) {
                        fileNum++;
                        copyFile(fileName, path.join(dest, fileName), options, cb);
                    } else if (stat.isDirectory()) {
                        readdir(fileName, cb);
                    }
                });
            }
        });
    }
    mkdir(dest, err => {
        if (err) return callback(err);
        readdir(src, callback);
    });
}

function cp(src, dest, options, callback) {
    if (typeof src !== "string") {
        throw new Error('The "src" argument must be of type string');
    }
    if (typeof dest !== "string") {
        throw new Error('The "src" argument must be of type string');
    }
    if (typeof options === "function") {
        callback = options;
        options = Object.assign({}, DEFAULT_OPTIONS);
    }
    if (!options) {
        options = Object.assign({}, DEFAULT_OPTIONS);
    } else {
        options = Object.assign({}, DEFAULT_OPTIONS, options);
    }
    if (typeof callback !== "function") {
        throw new Error("callback function required");
    }
    fs.stat(src, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isFile()) {
            copyFile(src, dest, options, callback);
        } else if (stat.isDirectory()) {
            copyDir(src, dest, options, callback);
        }
    });
}

module.exports = {
    cp
};