"use strict"

const fs = require("fs");
const path = require("path");
const { mkdir } = require("../mkdir");
const { getNotDirError } = require("./errors");

function check(target, callback) {
    fs.lstat(target, (err, stat) => {
        if (err) {
            if (err.code === "ENOENT") {
                mkdir(target, { recursive: true })
                    .then(() => callback(null))
                    .catch(err => callback(err));
            } else {
                callback(err);
            }

            return;
        }

        if (!stat.isDirectory()) {
            return callback(getNotDirError(target));
        }

        callback(null);
    });
}

function copyFile(source, target, overwrite, callback) {
    fs.lstat(target, (err, stat) => {
        if (
            err ||
            (stat && overwrite)
        ) {
            return fs.copyFile(source, target, err => {
                if (err) {
                    return callback(err)
                }

                callback(null);
            });
        }

        callback(null);
    });
}

function lstatAndCheck(source, target, callback) {
    fs.lstat(source, (err, stat) => {
        if (err) {
            return callback(err);
        }

        if (stat.isDirectory()) {
            check(target, err => {
                if (err) {
                    return callback(err);
                }

                callback(null, { directory: true });
            });
        } else {
            callback(null, { directory: false });
        }
    });
}

function _copy(source, target, options, callback) {
    let hasError = false;
    let called = false;
    let fileNum = 0;
    const { overwrite = true } = options || {};
    const invokeCb = function (e) {
        if (called) return;

        called = true;
        callback(e || null);
    }
    const _callback = err => {
        if (err) {
            return cb(err);
        }

        if (--fileNum <= 0) {
            invokeCb();
        }
    }
    const copyDir = (source, target, cb) => {
        if (hasError) return;

        fs.readdir(source, (err, files) => {
            if (err) {
                return cb(err);
            }

            fileNum += files.length;

            for (let file of files) {
                const filePath = path.join(source, file);
                const _target = path.join(target, file);

                if (hasError) break;

                lstatAndCheck(filePath, _target, (err, ret) => {
                    if (err) {
                        return cb(err);
                    }

                    if (ret.directory) {
                        fileNum--;

                        copyDir(filePath, _target, cb);
                    } else {
                        copyFile(filePath, _target, overwrite, _callback);
                    }
                });
            }
        });
    }

    copyDir(source, target, err => {
        if (err) {
            hasError = true;
        }

        invokeCb(err);
    });
}

function copy(source, target, options) {
    return new Promise((resolve, reject) => {
        _copy(source, target, options, err => {
            if (err) {
                return reject(err);
            }

            resolve(null);
        });
    });
}

module.exports = copy;