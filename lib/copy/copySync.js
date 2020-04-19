"use strict"

const fs = require("fs");
const path = require("path");
const { mkdirSync } = require("../mkdir");
const getError = require("../utils/getError");
const isSameDir = require("../utils/isSameDir");

function copySync(source, target, options) {
    const files = fs.readdirSync(source);
    const { overwrite = true } = options || {};

    if (isSameDir(source, target)) {
        return;
    }

    if (fs.existsSync(target)) {
        if (!fs.lstatSync(target).isDirectory()) {
            throw getError(
                `ENOTDIR: not a directory, scandir '${dir}'`,
                "ENOTDIR"
            );
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