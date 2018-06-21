function MultiSel(options) {
    this.input = $('<input type="text" readonly class="r-multi-input">');
    this.hiddenInput = $('<input type="hidden">'); //存放选中的值(表单提交)
    this.list = $('<ul class="r-multi-list"></ul>');
    if (!$.isPlainObject(options)) {
        options = {};
    }
    this.options = options;
}

function arrayIndexOf(arr, val, start) {
    if (Array.prototype.indexOf) {
        return arr.indexOf(val, start);
    }
    var i = start || 0,
        len = arr.length;
    var index = -1;
    for (; i < len; i++) {
        if (arr[i] === val) {
            index = i;
            break;
        }
    }
    return index;
}

MultiSel.prototype = {
    constructor: MultiSel,
    init: function (selector) {
        var el = $(selector);
        if (!el.prop("multiple")) {
            return;
        }
        var caret = $('<span class="r-multi-caret"></span>');
        this.hiddenInput.attr("name", el.attr("name")).insertAfter(el);
        this.input.css({
            cursor: "default",
            color: "#666"
        }).insertAfter(el);
        el.attr("name", "").hide();
        caret.insertAfter(this.input);
        this.initOptions(el);
        this.initEvent();
    },
    initOptions: function(select) {
        var options = select.children(),
            html = [],
            val = [],
            i = 0,
            len = options.length,
            tmp;
        for (; i < len; i++) {
            tmp = options.eq(i);
            if (tmp.prop("selected")) {
                val.push(tmp.val());
                li = '<li><label title="{text}"><input type="checkbox" class="check" checked value="{val}"/>{text}</label></li>';
            } else {
                li = '<li><label title="{text}"><input type="checkbox" class="check" value="{val}"/>{text}</label></li>';
            }
            li = li.replace(/(\{text\})|(\{val\})/g, function (match, $1, $2) {
                if ($1) {
                    return $1 = tmp.text();
                } else if ($2) {
                    return $2 = tmp.val();
                }
            });
            html.push(li);
        }
        this.hiddenInput.val(val.join(","));
        this.setText(val);
        this.list.append(html.join(""));
        $(document.body).append(this.list);
    },
    initEvent: function () {
        var ul = this.list,
            _this = this;
        this.input.on("click", function () {
            var rect = this.getBoundingClientRect();
            var display = ul.css("display");
            ul.css({
                left: rect.left,
                top: rect.bottom - 1
            });
            if (display === "none") {
                ul.fadeIn(150)
            } else {
                ul.fadeOut(150);
            }
        });
        this.list.on("change", ".check", function () {
            var $this = $(this);
            var val = _this.hiddenInput.val();
            val = val ? val.split(",") : [];
            if ($this.prop("checked")) {
                val.push($this.val());
            } else {
                val.splice(arrayIndexOf(val, $this.val()), 1);
            }
            _this.setText(val);
            _this.hiddenInput.val(val.join(","));
        });
        $(document).on("click", function (evt) {
            var tgt = evt.target;
            if (tgt !== ul[0] && tgt !== _this.input[0] && !ul[0].contains(tgt)) {
                ul.fadeOut(150);
            }
        });
    },
    setText: function (val) {
        val.length ?
            this.input.val("已选中" + val.length + "项") :
            this.input.val(this.options.defaultValue);
    },
    getSelected: function() {
        return this.hiddenInput.val().split(",");
    }
};
$.fn.extend({
    multiSel: function (options) {
        var i = 0,
            len = this.length,
            instance;
        if (typeof options === "string") {
            switch(options) {
                case "getSelected": 
                    instance = this.first().data("ms-instance");
                    if (instance) {
                        return instance.getSelected();
                    }
                    break;
            }
        } else {
            for (; i < len; i++) {
                instance = new MultiSel(options);
                instance.init(this[i]);
                this.eq(i).data("ms-instance", instance);
            }
        }
    }
});