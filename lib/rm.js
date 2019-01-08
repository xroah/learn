const fs = require("fs");
const path = require("path");

const factory = require("./factory");

function stat(p, callback) {
    fs.lstat(p, (err, stat) => {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            _rmDir(p, callback);
        } else {
            fs.unlink(p, callback);
        }
    });
}

function _rmDir(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return callback(err);
        }
        let fileNum = files.length;
        let cb = err => {
            if (err) {
                if (err.code === "EBUSY" || err.code === "EPERM") {
                    throw err;
                }
                if (err.code === "ENOENT") return;
                return callback(err);
            }
            if (--fileNum === 0) {
                fs.rmdir(dir, callback);
            }
        };
        if (!fileNum) {
            fs.rmdir(dir, callback);
            return;
        }
        for (let f of files) {
            f = path.join(dir, f);
            stat(f, cb);
        }
    });
}

function rmDir(dir, options, callback) {
    stat(dir, callback);
}

function toAbsPath(dir, files) {
    return files.map(f => path.resolve(dir, f));
}

function rmDirSync(dir, options) {
    let dirs = [dir];
    let stat = fs.lstatSync(dir);
    if (stat.isFile()) {
        fs.unlinkSync(dir);
        return;
    }
    let files = fs.readdirSync(dir);
    files = toAbsPath(dir, files);
    while (files.length) {
        let file = files.pop();
        stat = fs.lstatSync(file);
        if (stat.isDirectory()) {
            dirs.push(file);
            files.push(...toAbsPath(file, fs.readdirSync(file)));
        } else {
            fs.unlinkSync(file);
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