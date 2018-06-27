import Options from "./options";
import * as eName from "./event_name";

export default class Select {
    constructor(config, selector) {
        this.input = $('<span class="r-select-span"></span>');
        this.wrapper = $('<div class="r-select-wrapper" tabindex="0"></div>');
        this.el = $(selector);
        this.config = {
            ...config
        };
        //优先使用配置的multiple,否则检查el有没有设置multiple属性
        if (!this.config.multiple) {
            this.config.multiple = !!this.el.prop("multiple");
        }
        this.opened = this.disabled = false;
        this.init();
    }

    init() {
        let el = this.el;
        let caret = $('<span class="r-select-caret"></span>');
        if (el.get(0).nodeName.toLowerCase() === "select") {
            //如果配置没有传入data属性,则使用select的option的属性作为data
            if (!this.config.data || !this.config.data.length) {
                this.config.data = this.getSelectData(el);
            }
            //保存当前元素的display属性,destroy时还原
            el.data("display", el.css("display")).hide();
            el.prop("disabled") && this.disable();
            this.wrapper.append([this.input, caret]).insertAfter(el);
        } else {
            this.wrapper.append([this.input, caret]).appendTo(el);
        }
        this.list = new Options({
            data: this.config.data,
            multiple: this.config.multiple
        });
        this.documentClick = this._documentClick.bind(this);
        this.config.disabled && this.disable();
        this.updateVal(false);
        this.initEvent();
    }

    refresh(data) {
        let _data;
        if (this.el.get(0).nodeName.toLowerCase() === "select") {
            !data && console.warn("refresh方法未传入data,将使用option元素作为选项");
            _data = data || this.getSelectData(this.el);
        }
        this.config.data = _data;
        this.list.refresh(data);
        this.updateVal(false);
    }

    //获取select元素下的option,根据option的value和text设置data
    getSelectData(el) {
        let data = [];
        let config = el.children();
        for (let i = 0, len = config.length; i < len; i++) {
            let tmp = config.eq(i);
            data.push({
                value: tmp.val(),
                text: tmp.text(),
                selected: tmp.prop("selected"),
                disabled: tmp.prop("disabled")
            });
        }
        return data;
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
                    let el = this.list.keySelect("enter");
                    this.selectOne(el);
                } else {
                    this.open();
                }
                break;
            case "arrowup":
            case "up": //ie
                this.list.keySelect("up");
                break;
            case "arrowdown":
            case "down": //ie
                this.list.keySelect("down");
                break;
        }
    }

    blur() {
        //延迟获取当前活动元素,否则获取到的活动元素是body
        setTimeout(() => {
            let activeEl = document.activeElement;
            if (activeEl !== this.list.ul.get(0)) {
                this.close();
            } else {
                //在选项列表右键弹出菜单不会关闭
                //使其获取焦点，当点击右键菜单任一项时关闭列表
                this.wrapper.focus();
            }
        });
    }

    clickItem(evt) {
        let el = $(evt.currentTarget);
        let cls = "r-select-selected";
        let before;
        //点击的时候wrapper会失去焦点
        //使其重新获取焦点以便响应键盘事件
        this.wrapper.focus();
        if (el.hasClass("r-select-disabled")) return;
        //单选，选中当前li要取消之前选中的li
        //如果当前选中跟之前选中不是同一个则同时出发delselect和select时间
        if (!this.config.multiple) {
            if (el.hasClass(cls)){
                this.close();
                return;
            }
            before = el.siblings(`.${cls}`);
        }
        this.list.select(el.index(), el.hasClass(cls));
        this.selectOne(el, before);
    }

    initEvent() {
        let _this = this;
        this.wrapper.on("click", () => {
                if (this.disabled) return;
                this.opened ? this.close() : this.open();
            }).on("keydown", this.keyDown.bind(this))
            .on("blur", this.blur.bind(this));

        this.list.ul.on("mouseenter", ".r-select-item", function () {
            $(this).addClass("r-select-hover");
        }).on("mouseleave", ".r-select-item", function () {
            $(this).removeClass("r-select-hover");
        }).on("click", ".r-select-item", this.clickItem.bind(this));
        $(document).on("click", this.documentClick);
    }

    selectOne(el, deselectEl) {
        !this.config.multiple && this.close();
        if ($(el).hasClass("r-select-selected")) {
            //只有单选并且选中改变了才会触发
            if (
                deselectEl &&
                deselectEl.length &&
                !deselectEl.is(el)
            ) {
                this.el.trigger($.Event(eName.DESELECT, {
                    node: deselectEl.get(0)
                }));
            }
            this.el.trigger($.Event(eName.SELECT, {
                node: el.get(0)
            }));
        } else {
            //只有多选是才会出发
            this.el.trigger($.Event(eName.DESELECT, {
                node: el.get(0)
            }));
        }
        this.updateVal();
    }

    _documentClick(evt) {
        let tgt = evt.target,
            ul = this.list.ul;
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
        this.list.show({
            width: rect.width,
            left: rect.left,
            top: rect.bottom + 2
        });
    }

    open() {
        if (this.disabled) return;
        if (!this.opened) {
            this.opened = true;
            this.showList();
            this.wrapper.addClass("r-select-opened");
            this.el.trigger($.Event(eName.OPEN));
        }
    }

    close() {
        if (this.opened) {
            this.opened = false;
            this.list.hide();
            this.wrapper.removeClass("r-select-opened");
            this.el.trigger($.Event(eName.CLOSE));
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

    updateVal(triggerEvent = true) {
        let val = this.list.getSelected();
        if (this.multiple) {
            if (val.join("") === this.value.join("")) return;
        } else {
            if (val === this.value) return;
        }
        let evt = $.Event(eName.CHANGE, {
            value: val
        });
        this.value = val;
        this.setText();
        triggerEvent && this.el.trigger(evt);
    }

    setText() {
        let val = this.value;
        let {
            multiple,
            placeholder
        } = this.config;
        if (val && val.length) {
            this.input.removeClass("r-select-placeholder");
            if (multiple) {
                this.input.text(`已选中${val.length}项`);
            } else {
                this.input.text(val);
            }
        } else {
            this.input.addClass("r-select-placeholder").text(placeholder);
        }
    }

    setMultiVal(val) {
        let {
            data
        } = this.config;
        let value = [];
        if (!Array.isArray(val)) {
            val = [String(val)];
        }
        for (let i = 0, len = data.length; i < len; i++) {
            if (val.indexOf(data[i].value) > -1) {
                value.push(data[i].value);
                this.list.select(i);
            }
        }
        this.value = value;
    }

    setSingleVal(val) {
        let {
            data
        } = this.config;
        val = String(val);
        for (let i = 0, len = data.length; i < len; i++) {
            if (val === data[i].value) {
                this.value = val;
                this.list.select(i);
                break;
            }
        }
    }

    //暴露出去的设置value的方法
    val(val) {
        if (val !== undefined) {
            this.list.clearSlected();
            this.config.multiple ?
                this.setMultiVal(val) :
                this.setSingleVal(val);
            this.updateVal(false);
        }
        return this.value;
    }

    destroy() {
        this.wrapper.remove();
        this.list.destroy();
        $(document).off("click", this.documentClick);
        this.el.data("ms-instance", null).css("display", this.el.data("display"));
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                delete this[key];
            }
        }
    }
}