const fs = require("fs");
const checkPath = require("./checkPath");
const supportRecursive = require("./supportRecursive");
const handleOptions = require("./handleOptions");
const parseDir = require("./parseDir");
const getError = require("../utils/getError");

function _mkdirSync(dir, options) {

    if (fs.existsSync(dir)) {
        throw getError(
            `EEXIST: file already exists, mkdir '${dir}'`,
            "EXIST"
        );
    }

    const parsed = parseDir(dir);

    while (parsed.length) {
        const tmp = parsed.pop();

        if (!fs.existsSync(tmp)) {
            fs.mkdirSync(tmp, options);
        }
    }
}

function mkdirSync(dir, options) {
    options = handleOptions(options);
    const {
        recursive,
        ...others
    } = options;

    checkPath(dir);

    if (recursive) {
        if (supportRecursive) {
            fs.mkdirSync(dir, options);
        } else {
            _mkdirSync(dir, others);
        }

        return;
    }

    fs.mkdirSync(dir, options);
}

module.exports = mkdirSync;