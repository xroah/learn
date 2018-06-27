export default class Options {
    constructor(config) {
        this.data = config.data;
        this.callback = {
            onClick: config.onClick,
            onSelect: config.onSelect
        };
        this.multiple = !!config.multiple;
        this.ul = $('<ul class="r-select-options" tabindex="0"></ul>');
        this.selected = this.multiple ? [] : "";
        this.render();
    }

    getOneItem(obj, singleSlectedCallback) {
        let {
            value,
            text,
            disabled,
            selected
        } = obj;
        if (typeof singleSlectedCallback !== "function") singleSlectedCallback = () => {};
        let li = this.multiple ?
            `<li class="r-select-item">
                    <span class="r-checkbox-wrapper">
                        <span class="r-checkbox-outer"></span>
                        <span>{text}</span>
                    </span>
                </li>` : '<li class="r-select-item">{text}</li>';
        li = li.replace("{text}", text);
        li = $(li).attr("title", text).data("value", value);
        if (disabled) {
            li.addClass("r-select-disabled");
        }
        if (selected) {
            if (this.multiple) {
                this.selected.push(value);
                li.addClass("r-select-selected");
            } else {
                singleSlectedCallback(value);
            }
        }
        return li;
    }

    getItems(data) {
        let items = [];
        let selectedIndex = -1;
        let val = "";
        for (let i = 0, len = data.length; i < len; i++) {
            items.push(this.getOneItem(data[i], v => {
                selectedIndex = i;
                val = v;
            }));
        }
        if (!this.multiple) {
            this.selected = val;
            selectedIndex >= 0 && items[selectedIndex].addClass("r-select-selected");
        }
        if (!items.length) {
            items.push($('<li class="r-select-item r-select-disabled">无数据</li>'));
        }
        return items;
    }

    refresh(data) {
        this.data = data;
        this.selected = this.multiple ? [] : "";
        this.render();
    }

    getSelected() {
        let {
            selected,
            multiple
        } = this;
        if (multiple) {
            //复制一份,引用类型以防被外部改变
            return [...selected];
        }
        return selected;
    }

    /**
     * 
     * @param {number | Array} index 选择的索引
     * @param {boolean} deselect 选择/取消选择，仅对multiple有效
     */
    select(index, deselect) {
        let cls = "r-select-selected";
        let lis = this.ul.find(".r-select-item");
        let li = lis.eq(index);
        if (!li.length) return;
        let val = li.data("value");
        if (deselect) {
            li.removeClass(cls);
            if (this.multiple) {
                let i = this.selected.indexOf(val);
                this.selected.splice(i, 1);
            }
        } else {
            li.addClass(cls);
            if (this.multiple) {
                this.selected.push(val);
            } else {
                this.selected = val;
                li.siblings(`.${cls}`).removeClass(cls);
            }
        }
    }

    /**
     * 
     * @param {HTMLElement} curActive 当前active元素
     * @param {number} index active元素的索引
     * @param {number} step 1或者-1 向上或者向下查找的个数
     */
    findEl(curActive, index, step) {
        let aCls = "r-select-active";
        let max = 0;
        let lis = this.ul.find(".r-select-item");
        let len = lis.length;
        curActive.removeClass(aCls);
        if (index === undefined) {
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

    //键盘选择
    keySelect(dir) {
        let aCls = "r-select-active";
        let ul = this.ul;
        //当前鼠标hover的选项
        let curActive = ul.find(`.${aCls}`);
        let index;
        if (curActive.length) {
            index = curActive.index();
        } else {
            if ((curActive = ul.find(".r-select-hover")).length) {
                index = curActive.index();
            }
        }
        if (dir === "up") {
            this.findEl(curActive, index, -1);
        } else if (dir === "down") {
            this.findEl(curActive, index, 1);
        } else if (dir === "enter") {
            curActive = ul.find(`.${aCls}`);
            if (!curActive.length) {
                curActive = ul.find(".r-select-hover");
            }
            if (curActive.length) {
                index = curActive.index();
                this.select(index, curActive.hasClass("r-select-selected"));
                return curActive;
            }
        }
    }

    clearSlected() {
        let cls = "r-select-selected";
        this.ul.find(`.${cls}`).removeClass(cls);
        this.selected = this.multiple ? [] : "";
    }

    show(cssObj) {
        this.ul.css(cssObj).fadeIn(150);
    }

    hide() {
        this.ul
            .children(".r-select-active")
            .removeClass("r-select-active")
            .end()
            .children(".r-select-hover")
            .removeClass("r-select-hover")
            .end()
            .fadeOut(150);
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
    }
}