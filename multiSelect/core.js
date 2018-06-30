import Options from "./options";
import { ITEM_CLS } from "./classNames";
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
            //如果select元素是禁用状态,则禁用
            el.prop("disabled") && this.disable();
            this.wrapper.append([this.input, caret]).insertAfter(el);
        } else {
            this.wrapper.append([this.input, caret]).appendTo(el);
        }
        this.list = new Options({
            data: this.config.data,
            multiple: this.config.multiple,
            showSearch: this.config.showSearch
        });
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
    getSelectData(el, data) {
        data = data || [];
        let config = el.children();
        for (let i = 0, len = config.length; i < len; i++) {
            let tmp = config.eq(i);
            //optgroup分组
            if (tmp.get(0).nodeName.toLowerCase() === "optgroup") {
                let obj = {
                    value: "",
                    text: tmp.attr("label") || "分组",
                    disabled: tmp.prop("disabled"),
                    children: []
                };
                data.push(obj);
                this.getSelectData(tmp, obj.children);
            } else {
                data.push({
                    value: tmp.val(),
                    text: tmp.text(),
                    selected: tmp.prop("selected"),
                    disabled: tmp.prop("disabled")
                });
            }
        }
        return data;
    }

    getCurrentSingleSelectedEl() {
        if (!this.config.multiple) {
            //单选时,先获取之前选中,同点击选中
            return this.list.getCurrentSlectedEl();
        }
        return null;
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
                    let before = this.getCurrentSingleSelectedEl();
                    let el = this.list.keySelect("enter");
                    this.selectOne(el, before);
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

    //点击wrapper时,关闭或者打开
    clickWrapper() {
        //IE下点击的时候不会自动获得焦点
        this.wrapper.focus();
        this.opened ? this.close() : this.open();
    }

    //document没有焦点时候关闭
    closeWhenDocumentnoFocus() {
        if (!document.hasFocus()) {
            this.close();
            return true;
        }
        return false;
    }

    blur() {
        //延迟获取当前活动元素,否则获取到的活动元素是body
        setTimeout(() => {
            let activeEl = document.activeElement;
            let wrapper = this.wrapper.get(0);
            let _wrapper = this.list.wrapper.get(0);
            console.log(activeEl)
            if (this.closeWhenDocumentnoFocus()) return;
            //在选项列表右键弹出菜单不让选项关闭
            if (
                activeEl !== _wrapper &&
                !wrapper.contains(activeEl) &&  //IE下的span会获取焦点成为activeElement
                !_wrapper.contains(activeEl)
        ) {
                this.close();
            } else {
                //使其获取焦点，使其能触发blur事件
                //或者响应键盘事件
                //如果当前获取焦点元素是搜索框，wrapper则不获取焦点
                //否则搜索框一直不能获取焦点
                !$(activeEl).is(this.list.input) && this.wrapper.focus();
            }
        });
    }

    clickItem(evt) {
        let el = $(evt.currentTarget);
        let before;
        //点击的时候wrapper会失去焦点
        //使其重新获取焦点以便响应键盘事件
        this.wrapper.focus();
        if (this.list.isDisabled(el)) return;
        //否则先获取先前的选中项,再选中当前,以便触发deslect和select事件
        if (!this.config.multiple) {
            before = this.getCurrentSingleSelectedEl();
        }
        this.list.select(el);
        this.selectOne(el, before);
    }

    initEvent() {
        let blur = this.blur.bind(this);
        let keyDown = this.keyDown.bind(this);
        this.wrapper
            .on("click", this.clickWrapper.bind(this))
            .on("keydown", keyDown)
            .on("blur", blur);

        this.list.ul.on("click", `.${ITEM_CLS}`, this.clickItem.bind(this));
        if (this.config.showSearch) {
            this.list.input.on("blur", blur).on("keydown", keyDown);
        }
    }

    selectOne(el, deselectEl) {
        !this.config.multiple && this.close();
        //没有选中元素直接返回
        //如果鼠标没有在选项上并且没有键盘选择,
        //此时按下enter键并没有元素被选中
        if (!el || !el.length) return;
        if (this.list.isSelected(el)) {
            //只有单选并且选中改变了才会触发
            //单选，选中当前li要取消之前选中的li
            //如果当前选中跟之前选中不是同一个则同时触发delselect和select事件
            if (
                deselectEl &&
                deselectEl.length &&
                !el.is(deselectEl)
            ) {
                this.el.trigger($.Event(eName.DESELECT, {
                    node: deselectEl.get(0)
                }));
            }
            this.el.trigger($.Event(eName.SELECT, {
                node: el.get(0)
            }));
        } else {
            //只有多选是才会触发
            this.el.trigger($.Event(eName.DESELECT, {
                node: el.get(0)
            }));
        }
        this.updateVal();
    }

    showList() {
        let rect = this.wrapper.get(0).getBoundingClientRect();
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
        let text = this.list.getSelected(true);
        let {
            multiple,
            placeholder
        } = this.config;
        if (text.length) {
            this.input.removeClass("r-select-placeholder");
            if (multiple) {
                this.input.text(text.join(","));
            } else {
                this.input.text(text);
            }
        } else {
            this.input.addClass("r-select-placeholder").text(placeholder);
        }
    }

    //暴露出去的设置value的方法
    val(val) {
        if (val !== undefined) {
            //设置值得时候先清除所有选中
            this.list.clearSlected();
            this.list.selectByVal(val);
            //此时不触发change事件
            this.updateVal(false);
        }
        return this.value;
    }

    destroy() {
        this.wrapper.remove();
        this.list.destroy();
        this.el.data("ms-instance", null).css("display", this.el.data("display"));
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                delete this[key];
            }
        }
    }
}