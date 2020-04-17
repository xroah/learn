module.exports.getNotDirError = function getNotDirError(dir) {
    const err = new Error(
        `ENOTDIR: not a directory, scandir '${dir}'`
    );
    err.code = "ENOTDIR";

    return err;
}