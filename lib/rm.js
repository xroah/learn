const fs = require("fs");
const path = require("path");

function factory(async = true, fn) {
    return function operate(dir, options, callback) {
        if (typeof dir !== "string") {
            throw new Error('The "dir" argument must be of type string');
        }
        if (typeof options === "function") {
            callback = options;
            options = {};
        } else if (!options) {
            options = {};
        }
        if (async && typeof callback !== "function") {
            throw new Error("callback function required");
        }
        return fn(dir, options, callback);
    }
}

function rmDir(dir, options, callback) {
    function stat(p, callback) {
        fs.stat(p, (err, stat) => {
            if (err) {
                return callback(err);
            }
            if (stat.isDirectory()) {
                _rmDir(p, callback);
            } else if (stat.isFile()) {
                fs.unlink(p, callback);
            }
        })
    }

    function _rmDir(dir, callback) {
        fs.readdir(dir, (err, files) => {
            if (err) {
                return callback(err);
            }
            let fileNum = files.length;
            let cb = err => {
                if (err) {
                    if (err.code === "EBUSY") {
                        throw err;
                    }
                    if (err.code === "ENOENT") return;
                    return callback(err);
                }
                if (--fileNum <= 0) {
                    fs.rmdir(dir, callback);
                }
            };
            if (!fileNum) {
                cb();
                return;
            }
            for (let f of files) {
                f = path.join(dir, f);
                stat(f, cb);
            }
        });
    }
    stat(dir, callback);
}

function toAbsPath(dir, files) {
    return files.map(f => path.resolve(dir, f));
}

function rmDirSync(dir, options) {
    let dirs = [dir];
    let stat = fs.statSync(dir);
    if (stat.isFile()) {
        fs.unlinkSync(dir);
        return;
    }
    let files = fs.readdirSync(dir);
    files = toAbsPath(dir, files);
    while (files.length) {
        let file = files.pop();
        stat = fs.statSync(file);
        if (stat.isFile()) {
            fs.unlinkSync(file);
        } else if (stat.isDirectory()) {
            dirs.push(file);
            files.push(...toAbsPath(file, fs.readdirSync(file)));
        }
    }
    while (dirs.length) {
        fs.rmdirSync(dirs.pop());
    }
}

let rm = factory(true, rmDir);
let rmSync = factory(false, rmDirSync);

module.exports = {
    rm,
    rmSync
};