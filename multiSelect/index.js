function MultiSel(options) {
    this.input = $('<input type="text" readonly class="r-multi-input">');
    this.hiddenInput = $('<input type="hidden">'); //存放选中的值(表单提交)
    this.list = $('<ul class="r-multi-list"></ul>');
    if (!$.isPlainObject(options)) {
        options = {};
    }
    this.wrapper = $('<div class="r-multi-wrapper"></div>');
    this.options = options;
    this.opened = this.disabled = false;
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
            el.data("ms-instance", null);
            return;
        }
        var caret = $('<span class="r-multi-caret"></span>');
        this.hiddenInput.attr("name", el.attr("name"));
        el.data("display", el.css("display")).attr("name", "").hide();
        this.wrapper.append([this.input, this.hiddenInput, caret]).insertAfter(el);
        this.documentClick = $.proxy(this._documentClick, this);
        this.el = el;
        this.initOptions(el);
        this.initEvent();
    },
    initOptions: function (select) {
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
        this.input.on("click", function (evt) {
            if (this.disabled) return;
            var rect = this.getBoundingClientRect();
            ul.css({
                left: rect.left,
                top: rect.bottom - 1
            });
            _this.opened ? _this.close() : _this.open();
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
            _this.el.trigger("ms.change", [val]);
        });
        $(document).on("click", this.documentClick);
    },
    _documentClick: function (evt) {
        var tgt = evt.target,
            ul = this.list;
        if (tgt !== ul[0] && tgt !== this.input[0] && !ul[0].contains(tgt)) {
            this.close();
        }
    },
    open: function() {
        if (this.disabled) return;
        if (!this.opened) {
            this.opened = true;
            this.list.fadeIn(150);
            this.wrapper.addClass("opened");
        }
    },
    close: function () { 
        if (this.opened) {
            this.opened = false;
            this.list.fadeOut(150);
            this.wrapper.removeClass("opened");
        }
    },
    disable: function() {
        if (!this.disabled) {
            this.disabled = true;
            this.input.prop("disabled", true);
            this.wrapper.addClass("disabled");
        }
    },
    enable: function() {
        if (this.disabled) {
            this.disabled = false;
            this.input.prop("disabled", false);
            this.wrapper.removeClass("disabled");
        }
    },
    setText: function (val) {
        val.length ?
            this.input.val("已选中" + val.length + "项") :
            this.input.val(this.options.defaultValue);
    },
    destroy: function () {
        this.input.off();
        this.wrapper.remove();
        this.list.remove();
        $(document).off("click", this.documentClick);
        this.el.data("ms-instance", null).css("display", this.el.data("display"));
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                delete this[key];
            }
        }
    },
    getSelected: function () {
        var val = this.hiddenInput.val();
        return !val ? [] : val.split(",");
    }
};
$.fn.extend({
    multiSel: function (options) {
        var i = 0,
            len = this.length,
            instance,
            hasReturnValueFunc = {
                getSelected: true
            };
        if (typeof options === "string") {
            for (; i < len; i++) {
                instance = this.eq(i).data("ms-instance");
                if (instance) {
                    if (!(options in hasReturnValueFunc)) {
                        instance[options]();
                    } else {
                        return instance[options]();
                    }
                }
            }

        } else {
            for (; i < len; i++) {
                instance = new MultiSel(options);
                this.eq(i).data("ms-instance", instance);
                instance.init(this[i]);
            }
        }
        return this;
    }
});