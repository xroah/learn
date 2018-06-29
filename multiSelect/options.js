import * as cName from "./classNames";

export default class Options {
    constructor(config) {
        this.data = config.data;
        this.callback = {
            onClick: config.onClick,
            onSelect: config.onSelect
        };
        this.options = null; //所有的选项
        this.multiple = !!config.multiple;
        this.ul = $('<ul class="r-select-options" tabindex="0"></ul>');
        this.initSelected();
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
        li = $(li).attr("title", text).data("value", value);
        if (disabled) {
            li.addClass(cName.DISABLED_CLS);
        }
        if (selected) {
            if (this.multiple) {
                this.setMultipleSlected(value, text);
                li.addClass(cName.SELECTED_CLS);
            } else {
                this.setSingleSelected(value, text);
                this.lastSingleSelected = li;
            }
        }
        return li;
    }

    getItems(data) {
        let items = [];
        this.lastSingleSelected = null;
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
        if (this.lastSingleSelected) {
            this.lastSingleSelected.addClass(cName.SELECTED_CLS);
            delete this.lastSingleSelected;
        }
        if (!items.length) {
            items.push($(`<li class="${cName.ITEM_CLS} ${cName.DISABLED_CLS}">无数据</li>`));
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
        //如果分组有选项则添加,没有则不添加
        if (items.length) {
            group.append(opts.append(items));
        } else {
            group = null;
        }
        return group;
    }

    mouseHandler(evt) {
        let tgt = $(evt.currentTarget);
        let type = evt.type.toLowerCase();
        this.ul
            .find(`.${cName.ACTIVE_CLS}`)
            .removeClass(cName.ACTIVE_CLS);
        type === "mouseenter" ?
            tgt.addClass(cName.HOVER_CLS) :
            tgt.removeClass(cName.HOVER_CLS);
    }

    initEvent() {
        let selector = `.${cName.ITEM_CLS}`;
        let handler = this.mouseHandler.bind(this);
        this.ul.on("mouseenter", selector, handler)
            .on("mouseleave", selector, handler);
    }

    refresh(data) {
        this.data = data;
        this.initSelected();
        this.render();
    }

    getSelected(text) {
        let {
            selected,
            selectedText,
            multiple
        } = this;
        if (multiple) {
            //复制一份,引用类型以防被外部改变
            return text ? [...selectedText] : [...selected];
        }
        return text ? selectedText : selected;
    }

    isSelected(el) {
        return $(el).hasClass(cName.SELECTED_CLS);
    }

    isDisabled(el) {
        return $(el).hasClass(cName.DISABLED_CLS);
    }

    /**
     * 根据索引选择
     * @param {number | Array} index 选择的索引
     * @param {boolean} deselect 选择/取消选择，仅对multiple有效
     */
    selectByIndex(index) {
        let lis = this.options;
        let li = lis.eq(index);
        //index可能越界
        if (!li.length) return;
        if (Array.isArray(index)) {
            for (let i = index.length; i--;) {
                this.selectByIndex(i);
            }
            return;
        }
        this.select(li);
    }

    initSelected() {
        this.selectedText = this.multiple ? [] : "";
        this.selected = this.multiple ? [] : "";
    }

    setMultipleSlected(val, text) {
        this.selected.push(val);
        this.selectedText.push(text)
    }

    setSingleSelected(val, text) {
        this.selected = val;
        this.selectedText = text;
    }

    removeOneSelected(index) {
        this.selected.splice(index, 1);
        this.selectedText.splice(index, 1);
    }

    select(el) {
        let cls = cName.SELECTED_CLS;
        let val = el.data("value");
        let text = el.text();
        //多选时,如果当前是选中的则取消选中
        if (this.multiple && this.isSelected(el)) {
            let i = this.selected.indexOf(val);
            el.removeClass(cls);
            this.removeOneSelected(i);
            return;
        }
        if (this.multiple) {
            this.setMultipleSlected(val, text);
        } else {
            this.setSingleSelected(val, text);
            this.ul.find(`.${cls}`).removeClass(cls);
        }
        el.addClass(cls);
    }

    //根据值选择
    selectByVal(val) {
        let {
            data
        } = this;
        if (!this.multiple) {
            val = String(val);
            for (let i = 0, len = data.length; i < len; i++) {
                if (val === data[i].value) {
                    this.selectByIndex(i);
                    break;
                }
            }
            return;
        }
        if (!Array.isArray(val)) {
            val = [String(val)];
        }
        for (let i = 0, len = data.length; i < len; i++) {
            if (val.indexOf(data[i].value) > -1) {
                this.selectByIndex(i);
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} curActive 当前active元素
     * @param {number} step 1或者-1 向上或者向下查找的个数
     */
    findEl(curActive, step) {
        let aCls = cName.ACTIVE_CLS;
        let max = 0;
        let lis = this.options;
        let len = lis.length;
        let index = lis.index(curActive);
        curActive.removeClass(aCls);
        if (index === -1) {
            index = step < 0 ? 0 : -1;
        }
        //往上/往下找没有disabled的选项
        while (true) {
            index += step;
            if (index === -1) {
                index = len - 1;
            } else if (index === len) {
                index = 0;
            }
            curActive = lis.eq(index);
            if (!curActive.hasClass(cName.DISABLED_CLS)) {
                curActive.addClass(aCls);
                break;
            }
            if (max >= len) {
                break;
            }
            max++;
        }
    }

    //键盘选择
    keySelect(dir) {
        let aCls = cName.ACTIVE_CLS;
        let ul = this.ul;
        //当前鼠标hover的选项
        let curActive = ul.find(`.${aCls}`);
        if (!curActive.length) {
            curActive = ul.find(`.${cName.HOVER_CLS}`);
        }
        if (dir === "up") {
            this.findEl(curActive, -1);
        } else if (dir === "down") {
            this.findEl(curActive, 1);
        } else if (dir === "enter") {
            if (curActive.length) {
                this.select(curActive);
                return curActive;
            }
        }
    }

    clearSlected() {
        let cls = cName.SELECTED_CLS;
        this.ul.find(`.${cls}`).removeClass(cls);
        this.initSelected();
    }

    getCurrentSlectedEl() {
        let ret = this.ul.find(`.${cName.SELECTED_CLS}`);
        let opts = this.options;
        if (this.multiple) {
            for (let i = 0, len = opts.length; i < len; i++) {
                let tmp = opts.eq(o);
                if (tmp.hasClass(cName.SELECTED_CLS)) {
                    ret.push(tmp);
                }
            }
        }
        return ret;
    }

    show(cssObj) {
        this.ul.css(cssObj).fadeIn(150);
    }

    hide() {
        this.options
            .removeClass(cName.ACTIVE_CLS)
            .removeClass(cName.HOVER_CLS);
        this.ul.fadeOut(150);
    }

    destroy() {
        this.ul.remove();
    }

    render() {
        let items = this.getItems(this.data);
        this.ul.empty().append(items);
        if (!this.ul.parent().length) {
            this.ul.appendTo(document.body);
        }
        this.options = this.ul.find(`.${cName.ITEM_CLS}`);
    }
}