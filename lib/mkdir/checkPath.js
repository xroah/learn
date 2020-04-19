module.exports = function checkPath(dirPath) {
    if (process.platform === "win32") {
        const reg = /[:"\*\?<>\|]/;
        if (reg.test(dirPath)) {
            const err = new Error(`
            The pathname can't contain these characters: :"*?<>|
            `);
            err.code = "EINVAL";

            throw err;
        }
    }
}