const fs = require("fs");
const path = require("path");

const factory = require("./factory");

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
    fs.mkdir(dir, err => {
        if (!err) {
            return callback();
        }
        if (err.code !== "ENOENT" || !options.recursive) return callback(err);
        dirs = explodeDir(dir);
        len = dirs.length;
        _mkdir();
    });

    function _mkdir() {
        len--;
        fs.mkdir(dirs[len], {
            mode: options.mode
        }, err => {
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
    try {
        fs.mkdirSync(dir, {
            mode: options.mode
        });
        return;
    } catch (err) {
        if (err.code !== "ENOENT" || !options.recursive) throw err;
    }
    let dirs = [];
    dirs = explodeDir(dir);
    while (dirs.length) {
        let d = dirs.pop();
        if (!fs.existsSync(d)) {
            fs.mkdirSync(d, {
                mode: options.mode
            });
        }
    }
}

module.exports = {
    mkdir: factory(true, mkdir),
    mkdirSync: factory(false, mkdirSync)
};