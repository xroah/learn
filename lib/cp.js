const fs = require("fs");
const path = require("path");

const DEFAULT_OPTIONS = {
    replace: true
};

function parseDest(src, dest) {
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
    return {
        dir,
        fileName
    }
}

function copyFile(src, dest, options, callback) {
    let { dir, fileName } = parseDest(src, dest);
    options.mkdir = true;
    options.dir = dir;
    copyFileWithStream(src, fileName, options, callback);
}

function copyFileWithStream(src, dest, options, callback) {

    function _copy() {
        let rs = fs.createReadStream(src);
        let ws = fs.createWriteStream(dest);
        rs.pipe(ws);
        rs.once("end", callback);
    }

    fs.access(dest, err => {
        if (err || options.replace) {
            if (options.mkdir) {
                mkdir(options.dir, err => {
                    if (err) return callback(err);
                    _copy();
                });
            } else {
                _copy();
            }
            return;
        }
        callback();
    });
}

function parseDir(dir) {
    let dirs = [dir];
    let _dir = dir;
    while (_dir = path.parse(_dir).dir) {
        dirs.push(_dir);
    }
    return dirs;
}

function mkdir(dir, callback) {
    let len;
    let dirs;
    fs.mkdir(dir, err => {
        if (!err || err.code === "EEXIST") return callback();
        dirs = parseDir(dir);
        len = dirs.length;
        _mkdir();
    });

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
}

function copyDir(src, dest, options, callback) {
    let fileNum = 1; //src
    let cb = function (err) {
        if (err) {
            return callback(err);
        }
        if (--fileNum === 0) {
            callback();
        }
    }
    function readdir(dir, dest, callback) {
        fs.readdir(dir, (err, files) => {
            if (err) return callback(err);
            fileNum += files.length;
            callback();//call first after read successfully 
            if (!fileNum) {
                callback();
                return;
            }

            for (let file of files) {
                let fileName = path.join(dir, file);
                let destFile = path.join(dest, file);
                fs.stat(fileName, (err, stat) => {
                    if (err) return callback(err);
                    if (stat.isDirectory()) {
                        mkdir(destFile, err => {
                            if (err) return callback(err);
                            readdir(fileName, destFile, callback);
                        });
                    } else {
                        options.mkdir = false;
                        copyFileWithStream(fileName, destFile, options, callback);
                    }
                });
            }
        });
    }
    mkdir(dest, err => {
        if(err) return cb(err);
        readdir(src, dest, cb);
    })
}

function handleDefault(src, dest, options, callback) {
    if (typeof src !== "string") {
        throw new Error('The "src" argument must be of type string');
    }
    if (typeof dest !== "string") {
        throw new Error('The "src" argument must be of type string');
    }
    if (!options) {
        options = Object.assign({}, DEFAULT_OPTIONS);
    } else if (typeof options === "function") {
        callback = options;
        options = Object.assign({}, DEFAULT_OPTIONS);
    } else {
        options = Object.assign({}, DEFAULT_OPTIONS, options);
    }
    return {
        callback,
        options
    }
}

function cp(src, dest) {
    let { callback, options } = handleDefault.apply(null, arguments);
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

function copyFileSync(src, dest, options) {
    let { dir, fileName } = parseDest(src, dest);
    if (fs.existsSync(fileName)) {
        if (!options.replace) return;
    } else {
        mkdirSync(dir);
    }
    let stat = fs.statSync(src);
    let rFd = fs.openSync(src, "r");
    let wFd = fs.openSync(fileName, "w");
    let pos = 0;
    const READ_SIZE = 1024 * 1024;
    let buffer = Buffer.allocUnsafe(READ_SIZE);
    while(pos < stat.size) {
        let bytesRead = fs.readSync(rFd, buffer, 0, READ_SIZE, pos);
        fs.writeSync(wFd, buffer, 0, bytesRead);
        pos += bytesRead;
    }
}

function mkdirSync(p) {
    if (fs.existsSync(p)) return;
    let dirs = [];
    try {
        fs.mkdirSync(p);
    } catch (error) {
        dirs = parseDir(p);
    }
    while (dirs.length) {
        let d = dirs.pop();
        if (!fs.existsSync(d)) {
            fs.mkdirSync(d);
        }
    }
}

function copyDirSync(src, dest, options) {
    dest = path.join(dest, path.parse(src).base);
    mkdirSync(dest);
    let files = fs.readdirSync(src);
    for (let file of files) {
        let fileName = `${src}/${file}`;
        let stat = fs.statSync(fileName);
        if (stat.isDirectory()) {
            copyDirSync(fileName, dest, options);
        } else {
            copyFileSync(fileName, `${dest}/${file}`, options);
        }
    }
}

function cpSync(src, dest) {
    let { options } = handleDefault.apply(null, arguments);
    let stat = fs.statSync(src);
    if (stat.isFile()) {
        copyFileSync(src, dest, options);
    } else if (stat.isDirectory()) {
        copyDirSync(src, dest, options);
    }
}

module.exports = {
    cp,
    cpSync
};