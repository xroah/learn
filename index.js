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
        if (typeof callback !== "function") {
            throw new Error("callback function required");
        }
        return fn(dir, options, callback, async);
    }
}

function rmDir(dir, options, callback, async) {
    dir = path.resolve(dir);
    if (!async) {
        return rmDirSync(dir, options);
    }
    fs.stat(dir, (err, stat) => {
        if (err) {
            return callback(err)
        }
        if (stat.isFile()) {
            fs.unlink(dir, callback);
        } else if (stat.isDirectory()) {
            _rmDir(dir, options, callback);
        }
    });
}

function toAbsPath(dir, files) {
    return files.map(f => path.resolve(dir, f));
}

function printInfo(info, print) {
    if (print) {
        process.stdout.write(`removed ${info}\n`);
    }
}

function _rmDir(dir, options, callback) {
    let dirs = [dir];

    function readDir(dir) {
        fs.readdir(dir, (err, _files) => {
            if (err) return callback(err);
            _files = toAbsPath(dir, _files);
            for (let f of _files) {
                fs.stat(f, (err, s) => {
                    if (err) return callback(err);
                    if (s.isDirectory()) {
                        dirs.push(f);
                        readDir(f);
                    } else if (s.isFile()) {
                        fs.unlink(f, err => {
                            if (err) return callback(err);
                            printInfo(f, options.details);
                        });
                    }
                });
            }
        });
    }

    function removeDir() {
        if (dirs.length) {
            let d = dirs.pop();
            fs.rmdir(d, err => {
                if (err) {
                    if (err.code === "ENOTEMPTY") {
                        dirs.push(d);
                        setTimeout(removeDir);
                        return;
                    }
                    return callback(err);
                }
                printInfo(d, options.details);
                setTimeout(removeDir);
            })
        } else {
            callback();
        }
    }
    readDir(dir);
    removeDir();
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
            printInfo(file, options.details);
        } else if (stat.isDirectory()) {
            dirs.push(file);
            files.push(...toAbsPath(file, fs.readdirSync(file)));
        }
    }
    while (dirs.length) {
        fs.rmdirSync(dirs.pop());
        printInfo(file, options.details);
    }
}

let remove = factory(true, rmDir);
let removeSync = factory(false, rmDirSync);


module.exports = {
    remove,
    removeSync
};