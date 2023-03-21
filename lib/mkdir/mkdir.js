const fs = require("fs");
const checkPath = require("./checkPath");
const supportRecursive = require("./supportRecursive");
const handleOptions = require("./handleOptions");
const parseDir = require("./parseDir");

function mkdirRecursive(dir, options, callback) {
    const parsed = parseDir(dir);
    let hasError = false;

    const _callback = err => {
        if (
            !err ||
            err.code === "EEXIST"
        ) {
            return makeDir();
        }

        hasError = true;

        callback(err);
    };
    const makeDir = () => {
        const tmp = parsed.pop();

        if (hasError || !tmp) {
            !tmp && callback(null);

            return;
        }
        
        fs.mkdir(tmp, options, _callback);
    };

    makeDir();
}

function _mkdir(dir, options, callback) {
    const {
        recursive,
        ...others
    } = options;

    if (recursive) {
        const _callback = err => {
            if (err) {
                if (err.code === "ENOENT") {
                    mkdirRecursive(dir, others, callback);
                } else {
                    callback(err);
                }

                return;
            }

            callback(null);
        };

        fs.mkdir(
            dir,
            options,
            supportRecursive ? callback : _callback
        );

        return;
    } else {
        fs.mkdir(dir, options, callback);
    }
}

function mkdir(dir, options) {
    options = handleOptions(options);

    checkPath(dir);

    return new Promise((resolve, reject) => {
        _mkdir(dir, options, err => {
            if (err) {
                return reject(err);
            }

            resolve(null);
        });
    });
}

module.exports = mkdir;