!function() {
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
        this.boxSizing = el.css("box-sizing");
        return this;
    }

    fn.computeHeight = function(value) {
        var ta = doc.createElement("textarea"),
            width = this.size.orignalWidth, 
            height = this.size.orignalHeight;
        if (this.boxSizing === "border-box") {
            height += this.size.padding.top + this.size.padding.bottom + this.size.border.top + this.size.border.bottom;
            width += this.size.padding.left + this.size.padding.right + this.size.border.left + this.size.border.right;
        }
        $(ta).val(value).css({
            "position": "absolute",
            "visibility": "hidden",
            "overflow": "hidden",
            "box-sizing": this.boxSizing,
            "z-index": -1000,
            "width": width,
            "height": height,
            "padding-left": this.size.padding.left,
            "padding-right": this.size.padding.right,
            "padding-top": this.size.padding.top,
            "padding-bottom": this.size.padding.bottom
        });
        $(doc.body).append(ta);
        height = ta.scrollHeight; //scrollHeight不包含边框
        $(ta).remove();
        return height;
    }

    fn.setHeight = function() {
        var height = this.computeHeight(this.el.value);
        if (this.boxSizing === "content-box") {
            height = height - this.size.padding.top - this.size.padding.bottom;   
        }
        $(this.el).css("height", height);
        return this;
    }

    fn.initEvent = function() {
        $(this.el).on("input propertychange", $.proxy(this.setHeight, this)).on("keydown", function(evt) {
            var code = evt.keyCode;
            //ie9下按下backspace,delete键不会触发input事件
            if (code === 8 || code === 46) {
                $(this).trigger("input");
            } 
        })
        return this;
    }

    fn.init = function() {
        this.initEvent().initSize();
    }
    $.fn.extend({
        autoHeightTextArea: function() {
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