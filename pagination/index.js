const $ = window.$ || window.jQuery || jquery;
const doc = document;

if (!$) {
    throw new Error("插件依赖jQuery");
}

/**
 * 默认配置
 * @property {boolean} lite 简易模式，只显示首页/上一页/下一页/尾页
 * @property {number} total 数据总数
 * @property {number} visiblePages 可见页码数量，最小为3，简易模式忽略该配置
 * @property {number} pageNumber 每页显示的数据数量
 * @property {number} startPage 数据从第几页开始显示
 * @property {boolean} showFirstLast 是否显示首页/尾页按钮
 * @property {boolean} showJump 是否显示跳转
 * @property {string} position 页码的位置 left/center/right
 * @property {function} callback 翻页回调函数
 */
const DEFAULT_CONFIG = {
    lite: false,
    total: 0,
    visiblePages: 5,
    pageNumber: 10,
    startPage: 1,
    showFirstLast: false,
    showJump: false,
    position: "right",
    callback: function () { }
}

const DEFAULT_HTML = {
    home: '<li class="disabled"><a href="#" class="rpages-operate" data-i="home">首页</a></li>',
    prev: '<li class="disabled"><a href="#" class="rpages-operate" data-i="prev">上一页</a></li>',
    next: '<li class="disabled"><a href="#" class="rpages-operate" data-i="next">下一页</a></li>',
    last: '<li class="disabled"><a href="#" class="rpages-operate" data-i="last">尾页</a></li>',
    ellipse: '<li class="disabled rpages-ellipse"><a href="#">...</a></li>',
    current: '<li class="rpages-info"><span>{current}</span></li>',
    activeItem: '<li class="active"><a href="#" class="rpages-item" data-i="{i}">{i}</a></li>',
    item: '<li><a href="#" class="rpages-item" data-i="{i}">{i}</a></li>',
    jumpInput: '<li class="rpages-input"><input type="text" class="jump-input"><span class="rpages-increase"></span><span class="rpages-decrease"></span></li>',
    jumpBtn: '<li><button type="button" class="rpages-jump">跳转</button></li>'
}

let abs = value => Math.abs(parseInt(value));

/**
 * @param {string} selector css选择器
 * @param {object} config 配置
 */
let RPages = function (config) {
    if ($.isPlainObject(config)) {
        //abs返回的值可能为0或NaN
        let vPages = abs(config.visiblePages),
            tmp = { left: 'left', center: 'left', right: 'left' };
        this.config = {
            lite: !!config.lite,
            total: abs(config.total) || DEFAULT_CONFIG.total,
            visiblePages: vPages ? (vPages < 3 ? 3 : vPages) : DEFAULT_CONFIG.visiblePages,
            pageNumber: abs(config.pageNumber) || DEFAULT_CONFIG.pageNumber,
            startPage: abs(config.startPage) || DEFAULT_CONFIG.startPage,
            showFirstLast: !!config.showFirstLast,
            showJump: !!config.showJump,
            position: tmp[config.position] ? config.position : DEFAULT_CONFIG.position,
            callback: $.isFunction(config.callback) ? config.callback : DEFAULT_CONFIG.callback
        };
    } else {
        this.config = DEFAULT_CONFIG;
        console.warn('传入的配置不是一个对象');
    }
    this.timer = this.longClickTimer = null;
    this.totalPages = Math.ceil(this.config.total / this.config.pageNumber) || 1;
    this.currentPage = this.config.startPage > this.totalPages ? this.totalPages : this.config.startPage;
}

let fn = RPages.prototype;

fn.init = function (jqEl) {
    let nodeName = jqEl[0].nodeName.toLowerCase(),
        sfl = this.config.showFirstLast,
        //start用来存放[首页]上一页按钮
        //end用来存放下一页[尾页]
        //jump用来存放[jump按钮]
        defaultItem = {
            start: `${sfl ? DEFAULT_HTML.home : ''}${DEFAULT_HTML.prev}`,
            end: `${DEFAULT_HTML.next}${sfl ? DEFAULT_HTML.last : ''}${this.config.lite ? DEFAULT_HTML.current : ''}`,
            jump: `${DEFAULT_HTML.jumpInput}${DEFAULT_HTML.jumpBtn}`
        },
        ul = doc.createElement("ul"),
        ul1 = $(ul),
        ul2;
    jqEl.empty().off("page.change"); //off绑定的page.change事件,否则重新初始化会多次触发事件
    if (nodeName === 'ol' || nodeName === 'ul') {
        let li = $(doc.createElement("li"));
        jqEl.css("list-style", "none").append(li);
        jqEl = li;
    }
    ul1.addClass("rpages-list").html(defaultItem.start + defaultItem.end);
    jqEl.append(ul1).addClass(`rpages-text-${this.config.position} rpages-nowrap`);
    this.list = ul1;
    if (this.config.showJump) {
        this.jump = ul2 = $(ul.cloneNode());
        ul2.addClass("rpages-list").html(defaultItem.jump);
        jqEl.append(ul2);
        this.initJumpEvent();
    }
    this.render = this.config.lite ? this.renderLite : this.renderDefault;
    this.enable = this._enable.bind(this, defaultItem);
    return this.initEvent().render();
}

fn.generateActive = function (i) {
    return i === this.currentPage ?
        DEFAULT_HTML.activeItem.replace(/{i}/g, i) :
        DEFAULT_HTML.item.replace(/{i}/g, i);
}

fn.generateItems = function (start, end) {
    let items = [];
    while (start <= end) {
        items.push(this.generateActive(start++));
    }
    return items;
}

//生成页码
fn.generatePages = function () {
    let first = DEFAULT_HTML.item.replace(/{i}/g, 1),
        last = DEFAULT_HTML.item.replace(/{i}/g, this.totalPages),
        start = [first, DEFAULT_HTML.ellipse],
        end = [DEFAULT_HTML.ellipse, last],
        vPages = this.config.visiblePages;
    first = 1;
    last = this.totalPages;
    if (this.totalPages <= vPages) {
        start = end = [];
    } else if (this.currentPage < vPages - 1) {
        //最后一页前面添加省略号
        last = vPages - 1;
        start = [];
    } else if (this.currentPage > this.totalPages - vPages + 2) {
        //第一页后面添加省略号
        first = this.totalPages - vPages + 2;
        end = [];
    } else {
        //第一页后面及最后一页前面添加省略号
        //省略号之间显示的页码数量,当前页码显示在中间
        vPages -= 2;
        let mid = Math.ceil(vPages / 2),
            before = vPages - mid,
            after = vPages - before - 1;
        first = this.currentPage - before;
        last = this.currentPage + after;
    }
    return [...start, ...this.generateItems(first, last), ...end];
}

fn._enable = function (defaultItem, replace) {//去除class  disabled
    let start = defaultItem.start,
        end = defaultItem.end,
        reg = /disabled/g;
    if (this.totalPages > 1) {
        if (this.currentPage === 1) {
            end = end.replace(reg, '');
        } else if (this.currentPage === this.totalPages) {
            start = start.replace(reg, '');
        } else {
            start = start.replace(reg, '');
            end = end.replace(reg, '');
        }
    }
    return [start, replace, end].join('');
}

fn.html = function (html) {
    this.list.empty().html(html);
    return this;
}

//渲染简易模式
fn.renderLite = function () {
    let current = `${this.currentPage}/${this.totalPages}`;
    return this.html(this.enable().replace(/{current}/g, current));
}

//渲染普通模式
fn.renderDefault = function () {
    let items = this.generatePages().join('');
    return this.html(this.enable(items));
}

//调用回调函数，触发自定义事件
fn.invokeCallback = function () {
    this.list.trigger('page.change', this.currentPage);
    this.config.callback(this.currentPage);
    return this;
}

//翻页， 首页/上一页/下一页/尾页
fn.changePage = function (evt) {
    let $this = $(evt.target),
        pageStr = $this.data('i');
    $this = $this.parent();
    evt.preventDefault();
    if ($this.hasClass('disabled')) return;
    switch (pageStr) {
        case 'home':
            this.currentPage = 1;
            break;
        case 'prev':
            this.currentPage -= 1;
            break;
        case 'next':
            this.currentPage += 1;
            break;
        case 'last':
            this.currentPage = this.totalPages;
    }
    this.invokeCallback().render();
}

//点击页码
fn.clickNumber = function (evt) {
    let page = parseInt($(evt.target).data("i"));
    evt.preventDefault();
    this.jumpToPage(page);
}

fn.jumpToPage = function(page) {
    if (page !== this.currentPage) {
        this.currentPage = page;
        this.invokeCallback().render();
    }
}

fn.inputKeyDown = function (evt) {
    let key = evt.key.toLowerCase(),
        reg = /\d/,
        keymap = {
            arrowleft: 'arrowleft',
            left: 'left', //ie左键头
            arrowright: 'arrowright',
            right: 'right', //ie右箭头
            backspace: 'backspace',
            delete: 'delete'
        };
    switch (key) {
        case 'enter':
            //按下enter键跳转
            this.jump.find(".rpages-jump").trigger("click");
            break;
        case 'arrowup':
        case 'up': //ie
            //按下上箭头键增加
            this.increase();
            break;
        case 'arrowdown':
        case 'down': //ie
            //按下下箭头键减少
            this.decrease();
            break;
        default:
            //按下非数字按键禁止输入
            if (!(reg.test(key) || key in keymap)) {
                evt.preventDefault();
            }
    }
}

fn.increase = function () {
    let input = this.jump.find(".jump-input"),
        val = parseInt(input.val()) || 0;
    if (val < this.totalPages) {
        val++;
    }
    input.val(val);
}

fn.decrease = function () {
    let input = this.jump.find(".jump-input"),
        val = parseInt(input.val()) || 1;
    if (val > 1) {
        val--;
    }
    input.val(val);
}

fn.consecutive = function (callback) {
    this.longClickTimer = this.longClick(500, () => {
        this.timer = setInterval(callback, 100);
    });
}

fn.longClick = function (sec, callback) {
    return setTimeout(() => {
        callback();
    }, sec);
}

fn.clearTimer = function () {
    clearInterval(this.timer);
    clearTimeout(this.longClickTimer);
    this.timer = this.longClickTimer = null;
}

/**
 * 事件初始化
 * 自定义翻页事件(page.change)
 */
fn.initEvent = function () {
    var self = this;
    this.list.off("click").
        on('click', '.rpages-operate', this.changePage.bind(this)).
        on('click', ".rpages-item", this.clickNumber.bind(this));
    return this;
}

fn.initJumpEvent = function () {
    this.jump.off().
        on('keydown', '.jump-input', evt => this.inputKeyDown(evt)).
        on('keyup', '.jump-input', evt => {
            let tgt = $(evt.target),
                val = parseInt(tgt.val());
            //输入框为空时,parseInt返回的值为NaN
            //大于总页数时，值重置为总页数; 值为0，重置为1
            !isNaN(val) && tgt.val(val > this.totalPages ? this.totalPages : !val ? 1 : val);
        }).on("mousedown", ".rpages-increase", evt => {
            if (evt.button) return; //鼠标左键按下evt.button为0
            this.consecutive(this.increase.bind(this));
        }).on("mousedown", ".rpages-decrease", evt => {
            if (evt.button) return; //鼠标左键按下evt.button为0
            this.consecutive(this.decrease.bind(this));
        }).on("mouseleave mouseup", ".rpages-decrease, .rpages-increase", () => {
            this.clearTimer();
        }).
        on("click", ".rpages-increase", this.increase.bind(this)).
        on("click", ".rpages-decrease", this.decrease.bind(this)).
        on('click', '.rpages-jump', () => {
            let input = this.jump.find('.jump-input'),
                page = parseInt(input.val());
           //输入框为空时，input获取焦点 
            page ? this.jumpToPage(page) : input.focus();
        });
}

$.fn.extend({
    pagination: function (config) {
        return this.each(function () {
            new RPages(config).init($(this));
        });
    }
});