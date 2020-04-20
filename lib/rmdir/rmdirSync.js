"use strict"

const fs = require("fs");
const path = require("path");
const supportRetry = require("./supportRetry");
const shouldRetry = require("./shouldRetry");

function rmdir(dirPath, options) {
    const maxRetries = options.maxRetries || 0;
    let err;
    try {
        fs.rmdirSync(dirPath);
    } catch (error) {
        err = error;
    }

    if (shouldRetry(err) && maxRetries) {
        let count = 0;
        let retryDelay = options.retryDelay || 0;
        let now = Date.now();

        do {
            let _now = Date.now();

            if (_now - now >= retryDelay) {
                count++;
                now = _now;

                try {
                    fs.rmdirSync(dirPath);
                    err = null;
                    break;
                } catch (error) {
                    err = error;
                }
            }
        } while (count < maxRetries)
    }

    if (err) {
        throw err;
    }
}

function rmSubs(parentPath, options) {
    const files = fs.readdirSync(parentPath);

    if (!files.length) {
        return rmdir(parentPath, options);
    }

    files.forEach(file => {
        const filePath = path.join(parentPath, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            rmSubs(filePath, options);
        } else {
            fs.unlinkSync(filePath);
        }
    });

    rmdir(parentPath, options);
}

function rmdirSync(dirPath, options) {
    options = options || {};
    const {
        recursive,
        ...others
    } = options;

    //if support retry, also support recursive
    if (supportRetry) {
        return rmdir(dirPath, options);
    }

    if (!recursive) {
        rmdir(dirPath, options);
    } else {
        rmSubs(dirPath, others);
    }
}

module.exports = rmdirSync;