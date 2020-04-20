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

function _rmSubs(dirPath, options, status, cb) {
    if (status.hasError) return;

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return status.invokeCb(err);
        }

        let fileLen = files.length;
        let __rmdir = () => {
            _rmdir(dirPath, options, err => {
                if (err) {
                    return cb(err);
                }

                if (status.total <= 0) {
                    status.invokeCb();
                } else {
                    cb(null);
                }
            });
        }
        let _callback = err => {
            if (err) return status.invokeCb(err);

            if ((--status.total, --fileLen) <= 0) {
                __rmdir();
            }
        }
        status.total += fileLen;

        if (!fileLen) {
            return __rmdir();
        }

        for (let file of files) {
            let filePath = path.join(dirPath, file);

            if (status.hasError) break;

            fs.lstat(filePath, (err, stat) => {
                if (err) {
                    return cb(err);
                }

                if (stat.isDirectory()) {
                    return _rmSubs(filePath, options, status, _callback);
                }

                fs.unlink(filePath, _callback);
            });
        }
    });
}

function rmSubs(parentPath, options, callback) {
    const status = {
        hasError: false,
        called: false,
        total: 0,
        invokeCb(err) {
            if (this.called) return;

            this.called = true;

            callback(err || null);
        }
    };

    _rmSubs(parentPath, options, status, err => {
        if (err) {
            status.hasError = true;
        }

        status.invokeCb(err);
    });
}

function rmdir(dirPath, options) {
    options = options || {};
    const {
        recursive,
        ...others
    } = options;

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

        if (!recursive) {
            _rmdir(dirPath, options, callback);
        } else {
            rmSubs(dirPath, others, callback);
        }
    });
}

module.exports = rmdir;