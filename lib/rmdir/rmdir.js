"use strict"

const fs = require("fs");
const path = require("path");
const supportRetry = require("./supportRetry");
const shouldRetry = require("./shouldRetry");

function _rmdir(dirPath, options, callback) {
    let count = 0;
    const useNativeRmdir = () => {
        fs.rmdir(dirPath, err => {
            if (err) {
                retry(err);
            } else {
                callback(null);
            }
        });
    };
    const retry = err => {
        let maxRetries = parseInt(options.maxRetries) || 0;

        if (
            !shouldRetry(err) ||
            !maxRetries ||
            count >= maxRetries
        ) {
            return callback(err);
        }

        count++;

        setTimeout(useNativeRmdir, options.retryDelay || 0);
    };

    useNativeRmdir();
}

function rmSubs(parentPath, options, callback) {
    let origPath = parentPath;
    let hasError = false;
    let called = false;
    let invokeCb = err => {
        if (called) return;

        called = true;

        callback(err || null);
    };
    const _rmSubs = (dirPath, cb) => {
        if (hasError) return;

        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return cb(err);
            }

            let fileLen = files.length;
            let __rmdir = () => {
                _rmdir(dirPath, options, err => {
                    if (err) {
                        return cb(err);
                    }

                    if (dirPath === origPath) {
                        invokeCb();
                    } else {
                        cb(null);
                    }
                });
            }
            let _callback = err => {
                if (err) return cb(err);

                if (--fileLen <= 0) {
                    __rmdir();
                }
            }

            if (!fileLen) {
                __rmdir();
            }

            for (let file of files) {
                let filePath = path.join(dirPath, file);

                if (hasError) break;

                fs.lstat(filePath, (err, stat) => {
                    if (err) {
                        return cb(err);
                    }

                    if (stat.isDirectory()) {
                        _rmSubs(filePath, _callback);
                    } else {
                        fs.unlink(filePath, _callback);
                    }
                });
            }
        });
    };

    _rmSubs(origPath, err => {
        if (err) {
            hasError = true;
        }

        invokeCb(err);
    });
}

function rmdir(dirPath, options) {
    options = options || {};

    return new Promise((resolve, reject) => {
        const callback = err => {
            if (err) {
                return reject(err);
            }

            resolve(null);
        }

        if (supportRetry) {
            return fs.rmdir(dirPath, options, callback);
        }

        if (!options.recursive) {
            _rmdir(dirPath, options, callback);
        } else {
            rmSubs(dirPath, options, callback);
        }
    });
}

module.exports = rmdir;