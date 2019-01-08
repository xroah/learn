module.exports = function factory(async = true, fn) {
    return function operate(dir, options, callback) {
        if (typeof dir !== "string") {
            throw new Error('The "dir" argument must be of type string');
        }
        if (typeof options === "function") {
            callback = options;
            options = {};
        } else if (!options) {
            options = {};
        }
        if (async &&typeof callback !== "function") {
            throw new Error("callback function required");
        }
        return fn(dir, options, callback);
    }
}