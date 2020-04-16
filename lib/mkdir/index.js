const fs = require("fs");

function check(dirPath) {
    if (process.platform === "win32") {
        const reg = /[\\\/:"\*\?<>\|]/;
        if (reg.test(dirPath)) {
            const err = new Error(`
            The pathname can't contain these characters: \\/:"*?<>|
            `);
            err.code = "EINVAL";

            throw err;
        }
    }
}

module.exports = {
    mkdir(dirPath, options) {
        check(dirPath);

        return new Promise((resolve, reject) => {
            fs.mkdir(dirPath, options, err => {
                if (err) {
                    return reject(err);
                }

                resolve(null);
            });
        });
    },
    mkdirSync(dirPath, options) {
        check(dirPath);

        return fs.mkdirSync(dirPath, options);
    }
}