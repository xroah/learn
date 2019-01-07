const {rm, rmSync} = require("./lib/rm");
const {cp, cpSync} = require("./lib/cp");

function mv(src, dest, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    cp(src, dest, options, err => {
        if (err) return callback(err);
        rm(src, options, callback);
    });
}

function mvSync(src, dest, options) {
    cpSync(src, dest, options);
    rmSync(src, options);
}

module.exports = {
    rm,
    rmSync,
    cp,
    cpSync,
    mv,
    mvSync
};