module.exports = function handleOptions(options) {
    if (options == undefined) {
        return {};
    }

    if (typeof options === "number")  {
        return {
            mode: options
        };
    }

    return options;
}