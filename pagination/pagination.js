import {
    CHANGE
} from "./event_names";

/**
 * 默认配置
 * @property {number} total 数据总数
 * @property {number} visiblePages 可见页码数量，最小为3，小于3的时候不显示
 * @property {number} pageSize 每页显示的数据数量
 * @property {number} current 当前页码
 * @property {string} position 页码的位置 left/center/right
 * @property {string} prevText 上一页按钮显示的文本
 * @property {string} nextText 下一页按钮显示的文本
 * @property {function} onChange 翻页回调函数
 */
const DEFAULT_CONFIG = {
    total: 0,
    visiblePages: 5,
    pageSize: 10,
    current: 1,
    position: "right",
    prevText: "上一页",
    nextText: "下一页",
    onChange: function () {}
}

const PREFIX = "r-pagination";

export default class Pagination {
    constructor(config, el) {
        if (!$.isPlainObject(config)) {
            config = DEFAULT_CONFIG;
        }
        this.el = el;
        this.config = config = {
            ...DEFAULT_CONFIG,
            ...config
        };
        this.total = Math.ceil(config.total / config.pageSize) || 1;
        this.current = config.current > this.total ? this.total : config.current;
        this.list = null;
        this.init();
    }

    init() {
        let {
            el
        } = this;
        let nodeName = el.get(0).nodeName.toLowerCase();
        let {
            position
        } = this.config;
        let positionMap = {
            right: "right",
            left: "left",
            center: "center"
        };
        if (!positionMap[position]) {
            position = "right";
        }
        let ul = $(`<ul class="${PREFIX} ${PREFIX}-${position}"></ul>`);
        this.list = ul;
        if (nodeName === "ol" || nodeName === "ul") {
            this.list = el;
        }
        this.click = this.click.bind(this);
        this.render();
        this.initEvent();
    }

    getItems(start, end) {
        let items = [];
        while (start <= end) {
            let item = this.getOneItem(start, start);
            items.push(item);
            start++;
        }
        return items;
    }

    getOneItem(text, index, disabled) {
        let cls = `${PREFIX}-item`;
        if (index === this.current) {
            cls = `${cls} ${PREFIX}-active`;
        }
        if (disabled) {
            cls = `${cls} ${PREFIX}-disabled`;
        }
        return `<li class="${cls}">
                    <a href="#" data-i="${index}" class="${PREFIX}-link">${text}</a>
                </li>`;
    }

    //上一页  下一页按钮
    getEdge(current, total) {
        let {
            prevText,
            nextText
        } = this.config;
        let prev = this.getOneItem(prevText, "prev", current === 1);
        let next = this.getOneItem(nextText, "next", current === total);
        return [prev, next];
    }

    //生成页码
    generatePages() {
        let {
            current,
            total
        } = this;
        let {
            visiblePages
        } = this.config;
        let edge = this.getEdge(current, total);
        if (visiblePages < 3) {
            //小于3的时候只显示上一页、下一页
            return edge;
        }

        let start = [edge[0]];
        let end = [edge[1]];
        let first = 1;
        let last = total;
        if (visiblePages < total) {
            let tmp;
            let ellipsis = `<li class="${PREFIX}-item"><a class="${PREFIX}-ellipsis">...</a></li>`;
            first = this.getOneItem(1, 1);
            last = this.getOneItem(total, total);
            start.push(first);
            end.unshift(last);
            first = 2;
            last = total - 1;
            if (current < (tmp = visiblePages - 1)) {
                //最后一页前面添加省略号
                last = tmp;
                end.unshift(ellipsis);
            } else if (current > (tmp = total - visiblePages + 2)) {
                //第一页后面添加省略号
                first = tmp;
                start.push(ellipsis);
            } else {
                //第一页后面及最后一页前面添加省略号
                //省略号之间显示的页码数量,当前页码显示在中间
                visiblePages -= 2;
                tmp = Math.ceil(visiblePages / 2);
                prev = visiblePages - tmp;
                next = visiblePages - prev - 1;
                first = current - prev;
                last = current + next;
                start.push(ellipsis);
                end.unshift(ellipsis);
            }
        }
        return [...start, ...this.getItems(first, last), ...end];
    }

    isDisabled(el) {
        return el.hasClass(`${PREFIX}-disabled`);
    }

    isActive(el) {
        return el.hasClass(`${PREFIX}-active`);
    }

    click(evt) {
        let a = evt.currentTarget;
        let parent = $(a.parentNode);
        evt.preventDefault();
        if (
            this.isDisabled(parent) ||
            this.isActive(parent)
        ) return;

        let {
            current,
            el,
            config
        } = this;
        let index = a.dataset.i;
        switch (index) {
            case "prev":
                current--;
                break;
            case "next":
                current++;
                break;
            default:
                current = parseInt(index);
        }
        this.current = current
        this.render();
        config.onChange(current);
        el.trigger($.Event(CHANGE, {
            page: current
        }));
    }

    jumpTo(page) {
        page = parseInt(page);
        let {
            total,
            current
        } = this;
        if (isNaN(page) || page === current) return;
        this.current = page < 1 ? 1 :
            page > total ? total :
            page
        this.render();
    }

    getCurrentPage() {
        return this.current;
    }

    initEvent() {
        let {
            click,
            list,
            el
        } = this;;
        let selector = `.${PREFIX}-link`;
        el.off(CHANGE);
        list
            .off("click", selector, click)
            .on("click", selector, click)
    }

    destroy() {
        let {
            el,
            list,
            click
        } = this;
        if (el.is(list)) {
            list.empty()
                .off("click", `.${PREFIX}-link`, click);
        } else {
            list.remove();
        }
        for (let key in this) {
            delete this[key];
        }
        el.data("page-instance", null);
    }

    render() {
        let items = this.generatePages();
        let {
            el,
            list
        } = this;
        list.empty().html(items.join(""));
        if (!list.parent().length) {
            el.append(list);
        }
    }
}