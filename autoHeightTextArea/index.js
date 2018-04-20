! function () {
    var doc = document;

    function AutoHeightTextArea(el) {
        this.el = el;
        this.size = {};
    }
    var fn = AutoHeightTextArea.prototype;

    fn.initSize = function () {
        var el = $(this.el),
            style = getComputedStyle(this.el);
        this.size.padding = {
            top: parseFloat(style["padding-top"]),
            bottom: parseFloat(style["padding-bottom"]),
            left: parseFloat(style["padding-left"]),
            right: parseFloat(style["padding-right"])
        };
        this.size.orignalHeight = el.height();
        this.size.orignalWidth = el.width();
        this.size.border = {
            top: parseFloat(style["border-top-width"]),
            bottom: parseFloat(style["border-bottom-width"]),
            left: parseFloat(style["border-left-width"]),
            right: parseFloat(style["border-right-width"])
        };
        this.fontSize = style["font-size"];
        this.fontFamily = style["font-family"];
        this.boxSizing = style["box-sizing"];
        this.lineHeight = style["line-height"];
        return this;
    };

    fn.computeHeight = function (value) {
        //生成一个隐藏的textarea,复制当前textarea的属性
        //计算隐藏textarea的高度，设置到当前textarea上
        var ta = doc.createElement("textarea"),
            width = this.size.orignalWidth,
            height = this.size.orignalHeight,
            padding = this.size.padding,
            border = this.size.border;
        if (this.boxSizing === "border-box") {
            width += padding.left + padding.right + border.left + border.right;
            height += padding.top + padding.bottom + border.top + border.bottom;
        }
        $(ta).val(value).css({
            "position": "absolute",
            "visibility": "hidden",
            "font-size": this.fontSize,
            "font-family": this.fontFamily,
            "box-sizing": this.boxSizing,
            "z-index": -1000,
            "width": width,
            "height": height,
            "padding": getComputedStyle(this.el).getPropertyValue("padding"),
            "border": getComputedStyle(this.el).getPropertyValue("border")
        });
        $(doc.body).append(ta);
        height = ta.scrollHeight; //scrollHeight不包含边框
        $(ta).remove();
        return height;
    };

    fn.setHeight = function () {
        var height = this.computeHeight(this.el.value);
        if (this.boxSizing === "content-box") {
            height = height - this.size.padding.top - this.size.padding.bottom;
        }
        $(this.el).css("height", height);
        return this;
    };

    fn.initEvent = function () {
        $(this.el).on("input propertychange", $.proxy(this.setHeight, this)).on("keydown", function (evt) {
            var code = evt.keyCode,
                _this = $(this);
            if (code === 8 || code === 46) {
                //ie9下按下backspace,delete键不会触发input事件
                //如果当前删除最后一行的最后一个字符，并不会立即删除最后一行(最后一行是空白行)
                setTimeout(function () {
                    _this.trigger("input");
                });
            }
            //如果没有输入任何则不做处理(ie下bug)
            if (code === 13 && !$.trim(this.value)) {
                evt.preventDefault();
            }
        });
        return this;
    };

    fn.init = function () {
        this.initEvent().initSize().setHeight();
    };
    $.fn.extend({
        autoHeightTextArea: function (fn) {
            this.each(function () {
                var nodeName = this.nodeName.toLowerCase();
                if (nodeName === "textarea") {
                    new AutoHeightTextArea(this).init();
                }
            });
            return this;
        }
    });
}();