"use strict"

const {
    copy,
    copySync
} = require("../copy");
const {
    rmdir,
    rmdirSync
} = require("../rmdir");
const isSameDir = require("../utils/isSameDir");

module.exports = {
    move(source, target, options) {
        return new Promise((resolve, reject) => {
            if (isSameDir(source, target)) {
                return resolve(null);
            }

            copy(source, target, options).then(() => {
                return rmdir(source, { recursive: true });
            }).then(() => resolve(null))
                .catch(err => reject(err));
        });
    },
    moveSync(source, target, options) {
        if (isSameDir(source, target)) {
            return;
        }
        
        copySync(source, target, options);
        rmdirSync(source, { recursive: true });
    }
}