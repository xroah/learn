!function() {
    var doc = document;
    function AutoHeightTextArea(el) {
        this.el = el;
        this.size = {};
    }
    var fn = AutoHeightTextArea.prototype;

    fn.getComputeStyle = function(el, prop) {
        var style;
        if (window.getComputedStyle) {
            style = getComputedStyle(el, prop);
            return prop ? style.getPropertyValue(prop) : style;
        } else if (el.currentStyle) {
            style = el.currentStyle;
            return prop ? style[prop] : style;
        }
    };

    fn.initSize = function() {
        var el = $(this.el),
            style = this.getComputedStyle(this.el);
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

    fn.computeHeight = function(value) {
        var ta = doc.createElement("textarea"),
            width = this.size.orignalWidth, 
            height;
        if (this.boxSizing === "border-box") {
            width += this.size.padding.left + this.size.padding.right + this.size.border.left + this.size.border.right;
        }
        $(ta).val(value).css({
            "position": "absolute",
            "visibility": "hidden",
            "overflow": "hidden",
            "font-size": this.fontSize,
            "font-family": this.fontFamily,
            "box-sizing": this.boxSizing,
            "z-index": -1000,
            "width": width,
            "height": "auto",
            "padding-left": this.size.padding.left,
            "padding-right": this.size.padding.right,
            "padding-top": this.size.padding.top,
            "padding-bottom": this.size.padding.bottom,
            "line-height": this.lineHeight
        });
        $(doc.body).append(ta);
        height = ta.scrollHeight; //scrollHeight不包含边框
        $(ta).remove();
        return height;
    };

    fn.setHeight = function() {
        var height = this.computeHeight(this.el.value);
        if (this.boxSizing === "content-box") {
            height = height - this.size.padding.top - this.size.padding.bottom;   
        }
        $(this.el).css("height", height);
        return this;
    };

    fn.initEvent = function() {
        $(this.el).on("input propertychange", $.proxy(this.setHeight, this)).on("keydown", function(evt) {
            var code = evt.keyCode;
            //ie9下按下backspace,delete键不会触发input事件
            if (code === 8 || code === 46) {
                $(this).trigger("input");
            } 
        });
        return this;
    };

    fn.init = function() {
        this.
            initEvent()
            .initSize().
            setHeight();
    };
    $.fn.extend({
        autoHeightTextArea: function(fn) {
            this.each(function() {
                var nodeName = this.nodeName.toLowerCase();
                if (nodeName === "textarea") {
                    new AutoHeightTextArea(this).init();
                }
            });
            return this;
        }
    });
}();!function() {
    var doc = document;
    function AutoHeightTextArea(el) {
        this.el = el;
        this.size = {};
    }
    var fn = AutoHeightTextArea.prototype;

    fn.initSize = function() {
        var el = $(this.el);
        this.size.padding = {
            top: parseFloat(el.css("padding-top")),
            bottom: parseFloat(el.css("padding-bottom")),
            left: parseFloat(el.css("padding-left")),
            right: parseFloat(el.css("padding-right"))
        };
        this.size.orignalHeight = el.height();
        this.size.orignalWidth = el.width();
        this.size.border = {
            top: parseFloat(el.css("border-top-width")),
            bottom: parseFloat(el.css("border-bottom-width")),
            left: parseFloat(el.css("border-left-width")),
            right: parseFloat(el.css("border-right-width")) 
        };
        this.fontSize = el.css("font-size");
        this.fontFamily = el.css("font-family");
        this.boxSizing = el.css("box-sizing");
        this.lineHeight = el.css("line-height");
        return this;
    };

    fn.computeHeight = function(value) {
        var ta = doc.createElement("textarea"),
            width = this.size.orignalWidth, 
            height;
        if (this.boxSizing === "border-box") {
            width += this.size.padding.left + this.size.padding.right + this.size.border.left + this.size.border.right;
        }
        $(ta).val(value).css({
            "position": "absolute",
            "visibility": "hidden",
            "overflow": "hidden",
            "font-size": this.fontSize,
            "font-family": this.fontFamily,
            "box-sizing": this.boxSizing,
            "z-index": -1000,
            "width": width,
            "height": 0,
            "padding-left": this.size.padding.left,
            "padding-right": this.size.padding.right,
            "padding-top": this.size.padding.top,
            "padding-bottom": this.size.padding.bottom,
            "line-height": this.lineHeight
        });
        $(doc.body).append(ta);
        height = ta.scrollHeight; //scrollHeight不包含边框
        $(ta).remove();
        return height;
    };

    fn.setHeight = function() {
        var height = this.computeHeight(this.el.value);
        if (this.boxSizing === "content-box") {
            height = height - this.size.padding.top - this.size.padding.bottom;   
        }
        $(this.el).css("height", height);
        return this;
    };

    fn.initEvent = function() {
        $(this.el).on("input propertychange", $.proxy(this.setHeight, this)).on("keydown", function(evt) {
            var code = evt.keyCode;
            //ie9下按下backspace,delete键不会触发input事件
            if (code === 8 || code === 46) {
                $(this).trigger("input");
            } 
            //如果没有输入任何则不做处理(ie下bug)
            if (code === 13 && !$.trim(this.value)) {
                evt.preventDefault();
            }
        });
        return this;
    };

    fn.init = function() {
        this.initEvent().initSize().setHeight();
    };
    $.fn.extend({
        autoHeightTextArea: function(fn) {
            this.each(function() {
                var nodeName = this.nodeName.toLowerCase();
                if (nodeName === "textarea") {
                    new AutoHeightTextArea(this).init();
                }
            });
            return this;
        }
    });
}();