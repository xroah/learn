"use strict"

const path = require("path");

module.exports = function isSameDir(source, target) {
    const absSource = path.resolve(source).toLowerCase();
    const absTarget = path.resolve(target).toLowerCase();

    return absSource === absTarget;
}