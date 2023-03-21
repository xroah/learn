define(function (require) {
    var random = require("random");
    return function () {
        return random() + random();
    }
});