"use strict"

const fs = require("fs");
const path = require("path");
const { mkdir } = require("../mkdir");
const { getNotDirError } = require("./errors");
const isSameDir = require("../utils/isSameDir");

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

function readdirAndCheck(source, target, callback) {
    fs.readdir(source, (err, files) => {
        if (err) {
            return callback(err);
        }

        check(target, err => {
            if (err) {
                return callback(err);
            }

            callback(null, files);
        });
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
    const copyDir = (source, target, cb) => {
        if (isSameDir(source, target)) {
            return invokeCb();
        }

        readdirAndCheck(source, target, (err, files) => {
            if (hasError) return;

            if (err) {
                return cb(err);
            }

            fileNum += files.length;

            for (let file of files) {
                const filePath = path.join(source, file);
                const _target = path.join(target, file);

                if (hasError) break;

                fs.lstat(filePath, (err, stat) => {
                    if (err) {
                        return cb(err);
                    }

                    if (stat.isDirectory()) {
                        fileNum--;

                        copyDir(filePath, _target, cb);
                    } else {
                        copyFile(filePath, _target, overwrite, err => {
                            if (err) {
                                return cb(err);
                            }

                            if (--fileNum <= 0) {
                                invokeCb();
                            }
                        });
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