define(function(require, exports, module) {
    module.exports = function() {
        return Math.random() * 1000 >>> 0;
    }
});