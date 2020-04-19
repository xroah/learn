"use strict"

const fs = require("fs");
const path = require("path");
const { mkdir } = require("../mkdir");
const getError = require("../utils/getError");
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
            return callback(
                getError(
                    `ENOTDIR: not a directory, scandir '${dir}'`,
                    "ENOTDIR"
                )
                );
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

function copyFile(source, target, overwrite, callback) {
    fs.lstat(target, (err, stat) => {
        if (
            err || //file not exists
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

function _copyFile(source, target, status, cb) {
    fs.lstat(source, (err, stat) => {
        if (err) {
            return cb(err);
        }

        if (stat.isDirectory()) {
            status.fileNum--;

            return copyDir(source, target, status, cb);
        }

        copyFile(source, target, status.overwrite, err => {
            if (err) {
                return cb(err);
            }

            if (--status.fileNum <= 0) {
                status.callback();
            }
        });
    });
}
function copyDir(source, target, status, cb) {
    if (isSameDir(source, target)) {
        return status.callback();
    }

    readdirAndCheck(source, target, (err, files) => {
        if (status.hasError) return;

        if (err) {
            return cb(err);
        }

        status.fileNum += files.length;

        for (let file of files) {
            if (status.hasError) break;

            const filePath = path.join(source, file);
            const _target = path.join(target, file);

            _copyFile(filePath, _target, status, cb);
        }
    });
}

function _copy(source, target, options, callback) {
    const { overwrite = true } = options || {};
    const status = {
        hasError: false,
        called: false,
        fileNum: 0,
        overwrite,
        callback(e) {
            if (this.called) return;

            this.called = true;

            callback(e || null);
        }
    };

    copyDir(source, target, status, err => {
        if (err) {
            status.hasError = true;
        }

        status.callback(err);
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