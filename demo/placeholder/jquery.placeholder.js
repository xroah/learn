;!function() {
    if (!window.$ || !window.jQuery) {
        throw new Error("插件依赖jqeury");
    }
    var styles = {
        color: "#757575"
    }

    function isSurport() {
        var input = document.createElement("input");
        return "placeholder" in input;
    }

    function initEvent(el) {
        $(el).on("focus", function () {
            var _this = $(this);
            if (!isSurport() && _this.val() === _this.attr("placeholder")) {
                _this.val("").css("color", _this.data("origColor"));
            }
          }).on("blur", function () {
            var _this = $(this);
            if (!isSurport() && !_this.val()) {
                _this.val(_this.attr("placeholder")).css("color", styles.color);
            }
        });
    }

    $.fn.extend({
        placeholder: function() {
            this.each(function() {
                var _this = $(this),
                    color = _this.css("color"),
                    placeholder = _this.attr("placeholder");
                _this.data("origColor", color);
                if (!_this.val() && !isSurport()) {
                    _this.val(placeholder).css("color", styles.color);
                }
                initEvent(this);
            });
        }
    });
}();