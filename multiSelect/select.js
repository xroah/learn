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
            //优先使用select的options作为选项
            let data = this.getSelectData(el);
            //如果select元素没有option则使用配置的data
            data = data.length ? data : this.options.data;
            this.options.data = data;
            //保存当前元素的display属性,destroy时还原
            el.data("display", el.css("display")).hide();
            el.prop("disabled") && this.disable();
            this.initOptions(data);
            this.wrapper.append([this.input, caret]).insertAfter(el);
        } else {
            this.initOptions(this.options.data);
            this.wrapper.append([this.input, caret]).appendTo(el);
        }
        $(document.body).append(this.list);
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
    }

    refresh(data) {
        let _data;
        if (this.el.get(0).nodeName.toLowerCase() === "select") {
            !data && console.warn("refresh方法未传入data,将使用option元素作为选项");
            _data = data || this.getSelectData(this.el);
        }
        this.initOptions(_data);
    }

    //获取select元素下的option,根据option的value和text设置data
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
            val,
            //单选,如果有选中项,改变selectedIndex(选中最后一个)
            selectedIndex = -1;
        for (let i = 0, len = data.length; i < len; i++) {
            let tmp = data[i];
            let li = $('<li></li>');
            li.data("value", tmp.value).text(tmp.text).attr("title", tmp.text);
            if (tmp.selected) {
                val = tmp.value;
                selectedIndex = i;
            }
            if (tmp.disabled) {
                li.addClass("r-select-disabled");
            }
            html.push(li);
        }
        if (selectedIndex > -1) {
            html[selectedIndex].addClass("r-select-selected");
        }
        if (!html.length) {
            html.push('<li class="r-select-disabled">无数据</li>');
        }
        return {
            val: val,
            html: html
        }
    }

    //键盘选择
    keySelect(dir = "up") {
        let aCls = "r-select-active";
        //当前鼠标hover的选项
        let curActive = this.list.find(`.${aCls}`);
        let lis = this.list.children();
        let len = lis.length;
        let index;
        if (curActive.length) {
            index = curActive.index();
        } else {
            if ((curActive = this.list.find(".r-select-hover")).length) {
                index = curActive.index();
            }
        }
        curActive.removeClass(aCls);
        let max = 0;
        if (dir === "up") {
            if (index === undefined) index = 0;
            //往上找没有disabled的选项
            while(true) {
                index -= 1;
                if (index === -1) index = len - 1;
                curActive = lis.eq(index);
                if (!curActive.hasClass("r-select-disabled")) {
                    curActive.addClass(aCls);
                    break;
                }
                if (max >= len) {
                    break;
                }
                max++;
            }
        } else if (dir === "down") {
            if (index === undefined) index = -1;
            //往下找没有disabled的选项
            while(true) {
                index += 1;
                if (index === len) index = 0;
                curActive = lis.eq(index);
                if (!curActive.hasClass("r-select-disabled")) {
                    curActive.addClass(aCls);
                    break;
                }
                if (max >= len) {
                    break;
                }
                max++;
            }
        }
    }

    keyDown(evt) {
        let key = evt.key.toLowerCase();
        switch (key) {
            case "escape":
            case "esc": //ie
                this.close();
                break;
            case "enter":
                if (this.opened) {
                    let el = this.list.find(".r-select-active");
                    if (!el.length) {
                        el = this.list.find(".r-select-hover");
                    }
                    el.length && this.selectOne(el);
                } else {
                    this.open();
                }
                break;
            case "arrowup":
            case "up": //ie
                this.keySelect("up");
                break;
            case "arrowdown":
            case "down": //ie
                this.keySelect("down");
                break;

        }
    }

    initEvent() {
        let ul = this.list;
        let _this = this;
        this.wrapper.on("click", () => {
            if (this.disabled) return;
            this.opened ? this.close() : this.open();
        }).on("keydown", this.keyDown.bind(this));

        this.list.on("mouseenter", "li", function () {
            $(this).addClass("r-select-hover");
        }).on("mouseleave", "li", function () {
            $(this).removeClass("r-select-hover");
        }).on("click", "li", function () {
            let $this = clickTgt = $(this);
            if ($this.hasClass("r-select-disabled")) return;
            _this.selectOne($this);
        });
        $(document).on("click", this.documentClick);
    }

    selectOne(el) {
        let cls = "r-select-selected";
        el = $(el);
        el.addClass(cls).siblings(`.${cls}`).removeClass(cls);
        this.setText(this.value = el.data("value"));
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
        }).fadeIn(150);
    }

    open() {
        if (this.disabled) return;
        if (!this.opened) {
            this.opened = true;
            this.showList();
            this.wrapper.addClass("r-select-opened");
        }
    }

    close() {
        if (this.opened) {
            this.opened = false;
            this.list
                .children(".r-select-active")
                .removeClass("r-select-active")
                .end()
                .children(".r-select-hover")
                .removeClass("r-select-hover")
                .end()
                .fadeOut(150);
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

    val(val) {
        let lis = this.list.children();
        if (val !== undefined) {
            this.value = "";
            for (let i = 0, len = lis.length; i < len; i++) {
                let tmp = lis.eq(i);
                if (val === tmp.data("value")) {
                    this.setText(this.value = val);
                    tmp.addClass("r-select-selected");
                } else {
                    tmp.removeClass("r-select-selected");
                }
            }
        }
        return this.value;
    }
}