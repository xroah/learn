"use strict"

const fs = require("fs");
const path = require("path");
const { mkdirSync } = require("../mkdir");
const {getNotDirError} = require("./errors");

function copySync(source, target, options) {
    const files = fs.readdirSync(source);
    const { overwrite = true } = options || {};

    if (fs.existsSync(target)) {
        if (!fs.lstatSync(target).isDirectory()) {
            throw getNotDirError(target);
        }
    } else {
        mkdirSync(target, { recursive: true });
    }

    files.forEach(file => {
        const filePath = path.join(source, file);
        const stat = fs.lstatSync(filePath);
        const _target = path.join(target, file);

        if (stat.isDirectory()) {
            copySync(filePath, _target);
        } else {
            if (
                !fs.existsSync(_target) ||
                overwrite
            ) {
                fs.copyFileSync(filePath, _target);
            }
        }
    });
}

module.exports = copySync;