import * as cName from "./class_names";
import { SEARCH } from "./event_names";

export default class Options {
    constructor(config) {
        this.data = config.data;
        this.callback = {
            onClick: config.onClick,
            onSelect: config.onSelect
        };
        this.multiple = !!config.multiple;
        this.wrapper = $('<div class="r-select-options-wrapper" tabindex="0"></div>');
        this.ul = $('<ul class="r-select-options"></ul>');
        this.showSearch = !!config.showSearch;
        this.searchTimer = null;
        this.reset();
        this.initEvent();
        this.render();
    }

    getOneItem(obj) {
        let {
            value,
            text,
            disabled,
            selected
        } = obj;
        let li = this.multiple ?
            `<li class="${cName.ITEM_CLS}">
                    <span class="r-checkbox-wrapper">
                        <span class="r-checkbox-outer"></span>
                        <span>{text}</span>
                    </span>
                </li>` : '<li class="r-select-item">{text}</li>';
        value = String(value);
        li = li.replace("{text}", text);
        li = $(li).attr("title", text).data("value", value).data("text", text);
        if (disabled) {
            li.addClass(cName.DISABLED_CLS);
        }
        if (selected) {
            if (this.multiple) {
                //多选直接选中,多选的时候this.selected是一个数组，避免后面还要循环去选中
                this.setMultipleSlected(li);
                li.addClass(cName.SELECTED_CLS);
            } else {
                //单选的时候不设置选中的,因为传入的数据可能会有多个selected，
                //将selected的元素保存下来在render的时候设置选中(后面的覆盖前面的)
                this.selected = li;
            }
        }
        //将li push到options数组中
        this.options.push(li);
        return li;
    }

    getItems(data) {
        let items = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let tmp = data[i];
            if (!tmp.children) {
                //如果没有分组
                tmp = this.getOneItem(tmp);
                items.push(tmp);
            } else {
                tmp = this.getGroupItem(tmp)
                if (tmp) {
                    items.push(tmp);
                }
            }
        }
        return items;
    }

    getGroupItem(data) {
        let group = $(`<li class="r-select-group"><span>${data.text}</span></li>`);
        let opts = $('<ul class="r-select-group-options"></ul>');
        let items = [];
        let c = data.children;
        for (let i = 0, len = c.length; i < len; i++) {
            let li = this.getOneItem(c[i]);
            if (data.disabled) {
                li.addClass(cName.DISABLED_CLS);
            }
            items.push(li);
        }
        //如果分组有选项则添加，同时添加到groups数组中；
        //没有则不添加
        if (items.length) {
            group.append(opts.append(items));
            this.groups.push({
                el: group,
                children: items
            });
        } else {
            group = null;
        }
        return group;
    }

    removeActive() {
        if (this.activeEl) {
            this.activeEl.removeClass(cName.ACTIVE_CLS);
            this.activeEl = null;
        }
        if (this.hoverEl) {
            this.hoverEl.removeClass(cName.HOVER_CLS);
            this.hoverEl = null;
        }
    }

    mouseHandler(evt) {
        let tgt = $(evt.currentTarget);
        let type = evt.type.toLowerCase();
        if (this.isDisabled(tgt)) {
            this.hoverEl = null;
            return;
        }
        this.removeActive();
        if (type === "mouseenter") {
            tgt.addClass(cName.HOVER_CLS)
            this.hoverEl = tgt;
        } else {
            tgt.removeClass(cName.HOVER_CLS);
            this.hoverEl = null;
        }
    }

    initEvent() {
        let selector = `.${cName.ITEM_CLS}`;
        let handler = this.mouseHandler.bind(this);
        this.ul.on("mouseenter mouseleave", selector, handler);
    }

    reset() {
        //所有的选项
        this.options = [];
        this.selected = this.multiple ? [] : null;
        //所有的分组
        this.groups = [];
        this.activeEl = null; //当前键盘选择的元素
        this.hoverEl = null; //当前鼠标hover的元素
    }

    refresh(data) {
        this.data = data;
        this.reset();
        this.render();
    }

    getSelected(getText) {
        let {
            selected,
            multiple
        } = this;
        let text;
        let val;
        if (multiple) {
            text = [];
            val = [];
            for (let i = 0, len = selected.length; i < len; i++) {
                let tmp = selected[i];
                val.push(tmp.data("value"));
                text.push(tmp.data("text"));
            }
            return getText ? text : val;
        }
        if (selected) {
            val = selected.data("value");
            text = selected.data("text");
        }
        return getText ? text : val;
    }

    isSelected(el) {
        return $(el).hasClass(cName.SELECTED_CLS);
    }

    isDisabled(el) {
        return $(el).hasClass(cName.DISABLED_CLS);
    }

    isHidden(el) {
        333
        return $(el).hasClass(cName.HIDDEN_CLS);
    }

    setMultipleSlected(el) {
        this.selected.push(el);
    }

    setSingleSelected(el) {
        this.selected = el;
    }

    removeOneSelected(el, multiple) {
        el && el.removeClass(cName.SELECTED_CLS);
        if (multiple) {
            let { selected } = this;
            for (let i = 0, len = selected.length; i < len; i++) {
                if (selected[i].is(el)) {
                    selected.splice(i, 1);
                    break;
                }
            }
            return;
        }
        this.selected = null;
    }

    select(el) {
        el = $(el);
        let val = el.data("value");
        let text = el.text();
        //多选时,如果当前是选中的则取消选中
        if (this.multiple && this.isSelected(el)) {
            this.removeOneSelected(el, true);
            return;
        }
        if (this.multiple) {
            this.setMultipleSlected(el);
        } else {
            //先取消之前选中的
            this.removeOneSelected(this.selected);
            this.setSingleSelected(el);
        }
        el.addClass(cName.SELECTED_CLS);
    }

    //根据值选择
    selectByVal(val) {
        let {
            multiple,
            options
        } = this;
        if (!multiple) {
            val = String(val);
            for (let i = 0, len = options.length; i < len; i++) {
                let tmp = options[i];
                if (val === tmp.data("value")) {
                    this.select(tmp);
                    break;
                }
            }
            return;
        }
        if (!Array.isArray(val)) {
            val = [String(val)];
        }
        for (let i = 0, len = options.length; i < len; i++) {
            let tmp = options[i];
            if (val.indexOf(tmp.data("value")) > -1) {
                this.select(tmp);
            }
        }
    }

    //获取元素在options中的索引
    index(el) {
        let { options } = this;
        let index = -1;
        for (let i = 0, len = options.length; i < len; i++) {
            if (options[i].is(el)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * 按下键盘上下键时候切换
     * @param {HTMLElement} curActive 当前active元素
     * @param {number} step 1或者-1 向下或者向上查找的个数
     */
    findEl(step) {
        let aCls = cName.ACTIVE_CLS;
        let index = -1;
        let max = 0;
        let lis = this.options;
        let len = lis.length;
        let curActive = this.activeEl || this.hoverEl;
        if (curActive) {
            curActive.removeClass(aCls);
            index = this.index(curActive);
        }
        if (index === -1) {
            index = step < 0 ? 0 : -1;
        }
        //往上/往下找没有disabled/hidden的选项
        while (true) {
            index += step;
            if (index === -1) {
                index = len - 1;
            } else if (index === len) {
                index = 0;
            }
            let tmp = lis[index];
            if (!this.isDisabled(tmp) && !this.isHidden(tmp)) {
                this.activeEl = curActive = tmp;
                tmp.addClass(aCls);
                break;
            }
            if (max >= len) {
                break;
            }
            max++;
        }
        return curActive;
    }

    /**
     * 计算选项应该滚动的距离
     * 如果选项过多则下面的选项要滚动后才能显示出来
     * 当键盘选择时候计算滚动的距离使得选项能够显示
     * @param {HTMLElement} el 要滚动显示的来的元素(HTML元素非jQuery对象)
     * @param {string} dir 滚动的方向(上、下),取值up或者down
     */
    calcScrollTop(el, dir) {
        let wrapper = this.wrapper.get(0);
        let height = wrapper.getBoundingClientRect().height;
        let offsetTop = el.offsetTop;
        let elHeight = el.getBoundingClientRect().height;
        let scrollHeight = wrapper.scrollHeight;
        let scrollTop = 0;
        let currentScrollTop = wrapper.scrollTop;
        if (dir === "down") {
            scrollTop = offsetTop + elHeight - height;
        } else if (dir === "up") {
            scrollTop = offsetTop;
        }
        return scrollTop;
    }

    /**
     * 计算元素是否在显示区域内
     * @param {HTMLElement} el HTML元素，同上
     */
    isInView(el) {
        let wrapper = this.wrapper.get(0);
        let rect = wrapper.getBoundingClientRect();
        let elRect = el.getBoundingClientRect();
        return rect.bottom > elRect.bottom && rect.top < elRect.top;
    }

    //键盘选择
    keySelect(dir) {
        let activeEl;
        if (dir === "up") {
            activeEl = this.findEl(-1);
        } else if (dir === "down") {
            activeEl = this.findEl(1);
        } else if (dir === "enter") {
            activeEl = this.activeEl || this.hoverEl;
            activeEl && this.select(activeEl);
        }
        if (
            activeEl &&
            (dir === "up" || dir === "down")
        ) {
            let tmp = activeEl.get(0);
            if (!this.isInView(tmp)) {
                let scrollTop = this.calcScrollTop(tmp, dir);
                this.wrapper.scrollTop(scrollTop);
            }
        }
        return activeEl;
    }

    clearSlected() {
        let { multiple, selected } = this;
        if (multiple) {
            for (let i = 0, len = selected.length; i < len; i++) {
                selected[i].removeClass(cName.SELECTED_CLS);
            }
            selected = [];
        } else {
            selected && selected.removeClass(cName.SELECTED_CLS);
            selected = null;
        }
        this.selected = selected;
    }

    show(cssObj) {
        this.wrapper.css(cssObj).fadeIn(150);
    }

    //搜索之后有隐藏的option和group
    //当选项隐藏的时候显示出来，并且清空输入框的值
    showAllOptions() {
        //如果不显示搜索框,则不做操作
        if (!this.showSearch) return;
        let { groups, options } = this;
        for (let i = 0, len = groups.length; i < len; i++) {
            groups[i].el.removeClass(cName.HIDDEN_CLS);
        }
        for (let i = 0, len = options.length; i < len; i++) {
            options[i].removeClass(cName.HIDDEN_CLS);
        }
        this.input.val("");
    }

    hide() {
        this.removeActive();
        this.wrapper.fadeOut(150, () => {
            this.showAllOptions();
        });
    }

    destroy() {
        this.ul.remove();
        this.wrapper.remove();
        this.input && this.input.remove();
    }

    search() {
        let value = this.input.val();
        let reg = /([^\w\u4e00-\u9fa5\s\t])/g;
        //替换掉特殊字符如"\",否则new RegExp会报错
        value = value.replace(reg, "\\$1");
        reg = new RegExp(value, "i");
        let { options, groups } = this;
        for (let i = 0, len = options.length; i < len; i++) {
            let tmp = options[i];
            let text = tmp.data("text");
            if (!value.trim()) {
                tmp.removeClass(cName.HIDDEN_CLS);
            } else {
                if (reg.test(text)) {
                    tmp.removeClass(cName.HIDDEN_CLS);
                } else {
                    tmp.addClass(cName.HIDDEN_CLS);
                }
            }
        }
        //group
        for (let i = 0, len = groups.length; i < len; i++) {
            let tmp = groups[i];
            //过滤掉所有隐藏的元素
            let visibleEl = tmp.children.filter(el => !this.isHidden(el));
            //如果所有元素都隐藏，则将该组隐藏
            if (!visibleEl.length) {
                tmp.el.addClass(cName.HIDDEN_CLS);
            } else {
                tmp.el.removeClass(cName.HIDDEN_CLS);
            }
        }
    }

    onSearch() {
        //防止连续触发输入事件优化
        const DELAY = 350;
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
            this.searchTimer = null;
        }
        let search = this.search.bind(this);
        //移除之前鼠标、键盘选择的元素
        //否则当选择的选项跟搜索不匹配,选项是隐藏状态
        //此时再按键盘选择选项则可能选中的是隐藏的选项
        this.removeActive();
        this.searchTimer = setTimeout(search, DELAY);
        this.input.trigger($.Event("ms.search", { match: this.input.val() }));
    }

    isIE9() {
        let reg = /msie\s*9.0/i;
        return reg.test(navigator.userAgent);
    }

    ie9KeyDown(evt) {
        let key = evt.key.toLowerCase();
        if (
            key === "backspace" ||
            key === "del" ||
            evt.ctrlKey //ctrl+z, ctrl+y也不会触发input事件
        ) {
            this.onSearch();
        }
    }

    initSearch() {
        let search = this.onSearch.bind(this);
        this.input.on("input", search);
        //IE9 按下backspace delete键以及剪切不会触发input事件
        if (this.isIE9()) {
            this.input
                .on("keydown", this.ie9KeyDown.bind(this))
                .on("cut", search)
        }
    }

    render() {
        let items = this.getItems(this.data);
        this.ul.empty().append(items);
        if (!this.wrapper.parent().length) {
            let inputWrapper;
            if (this.showSearch) {
                this.input = $('<input type="text" class="r-select-search"/>');
                inputWrapper = $('<div class="r-select-search-wrapper"></div>');
                inputWrapper.append(this.input);
                this.wrapper.append(inputWrapper);
                this.initSearch();
            }
            this.wrapper
                .append(this.ul)
                .appendTo(document.body);
        }
        let selected = this.selected;
        if (!this.multiple && selected) {
            this.select(selected);
        }
        //默认选中第一项
        if (!selected || !selected.length) {
            this.select(this.options[0]);
        }
    }
}