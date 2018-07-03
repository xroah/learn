import {
    CHANGE
} from "./event_names";

/**
 * 默认配置
 * @property {number} total 数据总数
 * @property {number} visiblePages 可见页码数量，最小为3，小于3的时候不显示
 * @property {number} pageSize 每页显示的数据数量
 * @property {number} current 当前页码
 * @property {boolean} showJump 是否显示跳转
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
        this.prev = null; //上一页按钮
        this.next = null; //下一页
        this.list = null; //页码列表UL
        this.init();
    }

    init() {
        let nodeName = this.el.get(0).nodeName.toLowerCase();
        let {
            prevText,
            nextText,
            position
        } = this.config;
        let positionMap = {
            right: "right",
            left: "left",
            center: "center"
        };
        if (!(position in positionMap)) {
            position = "right";
        }
        let ul = $(`<ul class="${PREFIX} ${PREFIX}-${position}"></ul>`);
        this.list = ul;
        if (nodeName === "ol" || nodeName === "ul") {
            this.list = this.el;
        }
        this.prev = this.getOneItem(prevText, "prev");
        this.next = this.getOneItem(nextText, "next");
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

    getOneItem(text, index) {
        let li = $(`<li class="${PREFIX}-item"></li>`);
        let a = $(`<a href="#" data-i="${index}" class="${PREFIX}-link">${text}</a>`);
        if (index === this.current) {
            li.addClass(`${PREFIX}-active`);
        }
        return li.append(a);
    }

    //生成页码
    generatePages() {
        let {
            prev,
            next,
            current,
            total
        } = this;
        let {
            visiblePages
        } = this.config;
        
        if (visiblePages < 3) {
            //小于3的时候只显示上一页、下一页
            return [prev, next];
        }

        let firstItem = this.getOneItem(1, 1);
        let lastItem = this.getOneItem(total, total);
        let ellipsis = $(`<li class="${PREFIX}-item"><a class="${PREFIX}-ellipsis">...</a></li>`);
        let start = [prev, firstItem];
        let end = [lastItem, next];
        let first = 2;
        let last = total - 1;
        let tmp;
        if (visiblePages < total) {
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
                let mid = Math.ceil(visiblePages / 2),
                    before = visiblePages - mid,
                    after = visiblePages - before - 1;
                first = current - before;
                last = current + after;
                start.push(ellipsis.clone());
                end.unshift(ellipsis.clone());
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
        let a = $(evt.currentTarget);
        let parent = a.parent();
        evt.preventDefault();
        if (
            this.isDisabled(parent) ||
            this.isActive(parent)
        ) return;

        let {
            current,
            el
        } = this;
        let index = a.attr("data-i");
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
        this.config.onChange(current);
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
        page = page < 1 ? 1 :
            page > total ? total :
            page
        this.current = page;
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
        let selector = `.${PREFIX}-link`;
        if (el.is(list)) {
            list.empty()
                .off("click", selector, click);
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
            current,
            total,
            prev,
            next,
            el,
            list
        } = this;
        let disabledCls = `${PREFIX}-disabled`;
        prev.removeClass(disabledCls);
        next.removeClass(disabledCls);
        if (current === 1) {
            prev.addClass(disabledCls);
        } else if (current === total) {
            next.addClass(disabledCls);
        }
        if (!list.parent().length) {
            el.append(list);
        }
        list
            .empty()
            .append(items);
    }
}