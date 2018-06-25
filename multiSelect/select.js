export default class Select {
    constructor(options) {
        this.input = $('<span class="r-select-span"></span>');
        this.list = $('<ul class="r-select-options"></ul>');
        this.value = "";
        this.wrapper = $('<div class="r-select-wrapper" tabindex="0"></div>');
        this.options = { ...options
        };
        this.opened = this.disabled = false;
    }

    init(selector) {
        let el = $(selector);
        let caret = $('<span class="r-select-caret"></span>');
        if (el.get(0).nodeName.toLowerCase() === "select") {
            let data = this.getSelectData(el);
            //如果select元素没有option则使用配置的data
            data = data.length ? data : this.options.data;
            this.initOptions(data);
            this.options.data = data;
            el.data("display", el.css("display")).hide();
            if (el.prop("disabled")) {
                this.disable();
            }
            this.wrapper.append([this.input, caret]).insertAfter(el);
        } else {
            this.initOptions(this.options.data);
            this.wrapper.append([this.input, caret]).appendTo(el);
        }
        this.options.disabled && this.disable();
        this.documentClick = this._documentClick.bind(this);
        this.el = el;
        this.initEvent();
    }

    initOptions(data) {
        let {
            html,
            val
        } = this.initOptionsByData(data);
        this.value = val;
        this.setText(val);
        this.list.empty().append(html);
        $(document.body).append(this.list);
    }

    getSelectData(el) {
        let data = [];
        let options = el.children();
        for (let i = 0, len = options.length; i < len; i++) {
            let tmp = options.eq(i);
            data.push({
                value: tmp.val(),
                text: tmp.text(),
                selected: tmp.prop("selected"),
                disabled: tmp.prop("disabled")
            });
        }
        return data;
    }

    initOptionsByData(data) {
        let html = [],
            val;
        for (let i = 0, len = data.length; i < len; i++) {
            let tmp = data[i];
            let li = $('<li></li>');
            li.data("value", tmp.value).text(tmp.text).attr("title", tmp.text);
            if (tmp.selected) {
                val = tmp.value;
                li.addClass("r-select-selected")
            }
            if (tmp.disabled) {
                li.addClass("r-select-disabled");
            }
            html.push(li);
        }
        if (!html.length) {
            html.push('<li class="r-select-disabled">无数据</li>');
        }
        return {
            val: val,
            html: html
        }
    }

    initEvent() {
        let ul = this.list,
            _this = this;
        this.wrapper.on("click", () => {
            if (this.disabled) return;
            this.showList();
            this.opened ? this.close() : this.open();
        }).on("keydown", function (evt) {
            let key = evt.key.toLowerCase();
            if (key === "enter") {
                $(this).trigger("click");
            }
        });
        this.list.on("mouseenter", "li", function () {
            $(this).addClass("r-select-hover");
        }).on("mouseleave", "li", function () {
            $(this).removeClass("r-select-hover");
        }).on("click", "li", function () {
            if ($(this).hasClass("r-select-disabled")) return;
            _this.selectOne($(this));
        });
        $(document).on("click", this.documentClick);
    }

    selectOne(el) {
        let cls = "r-select-selected";
        $(el).addClass(cls).siblings(`.${cls}`).removeClass(cls);
        this.setText(this.value = $(el).data("value"));
        this.close();
        this.wrapper.focus();
    }

    _documentClick(evt) {
        let tgt = evt.target,
            ul = this.list;
        if (
            tgt !== ul[0] &&
            !ul[0].contains(tgt) &&
            tgt !== this.wrapper[0] &&
            !this.wrapper[0].contains(tgt)
        ) {
            this.close();
        }
    }

    showList() {
        let rect = this.input.get(0).getBoundingClientRect();
        this.list.css({
            width: rect.width,
            left: rect.left,
            top: rect.bottom + 2
        });
    }

    open() {
        if (this.disabled) return;
        if (!this.opened) {
            this.opened = true;
            this.list.fadeIn(150);
            this.wrapper.addClass("r-select-opened");
        }
    }

    close() {
        if (this.opened) {
            this.opened = false;
            this.list.fadeOut(150);
            this.wrapper.removeClass("r-select-opened");
        }
    }

    disable() {
        if (!this.disabled) {
            this.disabled = true;
            this.wrapper.addClass("r-select-disabled");
        }
    }

    enable() {
        if (this.disabled) {
            this.disabled = false;
            this.wrapper.removeClass("r-select-disabled");
        }
    }

    setText(val) {
        if (val) {
            this.input.removeClass("r-select-placeholder").text(val);
        } else {
            this.input.addClass("r-select-placeholder").text(this.options.placeholder);
        }
    }

    destroy() {
        this.wrapper.remove();
        this.list.remove();
        $(document).off("click", this.documentClick);
        this.el.data("ms-instance", null).css("display", this.el.data("display"));
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                delete this[key];
            }
        }
    }

    val() {
        return this.value;
    }
}