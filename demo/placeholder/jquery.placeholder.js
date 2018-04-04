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
        //focus,blur时间不支持冒泡
        $(document.body).on("focusin", function (evt) {
            var _this = $(el);
            if (evt.target !== el) return;
            if (!isSurport() && _this.val() === _this.attr("placeholder")) {
                _this.val("").css("color", _this.data("origColor"));
            }
          }).on("focusout", function (evt) {
            var _this = $(el);
            if (evt.target !== el) return;
            if (!isSurport() && !_this.val()) {
                _this.val(_this.attr("placeholder")).css("color", styles.color);
            }
        }).attr("tabIndex", 0);
    }

    $.fn.extend({
        placeholder: function() {
            this.each(function() {
                var _this = $(this),
                    color = _this.css("color"),
                    placeholder = _this.attr("placeholder");
                _this.data("origColor", color);
                if (!isSurport()) {
                    initEvent(this);
                    !_this.val() && _this.val(placeholder).css("color", styles.color);
                }
            });
        }
    });
}();