const fs = require("fs");
const path = require("path");

function explodeDir(dir) {
    let dirs = [dir];
    let _dir = dir;
    while (_dir = path.parse(_dir).dir) {
        dirs.push(_dir);
    }
    return dirs;
}

function mkdir(dir, options, callback) {
    let len;
    let dirs;
    if (typeof dir !== "string") {
        throw new Error('The "dir" argument must be of type string');
    }
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (!options) {
        options = {};
    }
    if (typeof callback !== "function") {
        throw new Error("callback function required");
    }
    if (!options.recursive) {
        return fs.mkdir(dir, {mode: options.mode}, callback);
    }
    fs.mkdir(dir, err => {
        if (!err || err.code === "EEXIST") return callback();
        dirs = explodeDir(dir);
        len = dirs.length;
        _mkdir();
    });

    function _mkdir() {
        len--;
        fs.mkdir(dirs[len], err => {
            if (err) {
                if (err.code !== "EEXIST") {
                    return callback(err);
                }
            }
            if (len === 0) {
                return callback();
            }
            _mkdir();
        });
    }
}

function mkdirSync(dir, options) {
    if (typeof dir !== "string") {
        throw new Error('The "dir" argument must be of type string');
    }
    if (!options) {
        options = {};
    }
    if (fs.existsSync(dir)) return;
    let dirs = [];
    try {
        fs.mkdirSync(dir);
    } catch (error) {
        if (!options.recursive) {
            console.error(error);
            return;
        }
        dirs = explodeDir(dir);
    }
    while (dirs.length) {
        let d = dirs.pop();
        if (!fs.existsSync(d)) {
            fs.mkdirSync(d);
        }
    }
}

module.exports = {
    mkdir,
    mkdirSync
};