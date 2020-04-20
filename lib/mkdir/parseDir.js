const path = require("path");

module.exports = function parseDir(dir) {
    let ret = [dir];
    let obj;

    while((obj = path.parse(dir)) && obj.dir !== obj.root) {
        ret.push(dir = obj.dir);
    }

    return ret;
}