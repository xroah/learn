!function () { 
    function ImatitionSelect(appendTo,data) {
        //目标元素容器,插件的父元素
        this.target = appendTo;
        this.selected = null;
        this.value = "";
        this.data = data;
    }
    
    var fn = ImatitionSelect.prototype,
        doc = document;
    
    fn.show = function() {
        var me = this;
		this.options.find(".selected").removeClass("selected");
        if (this.selected) {
            this.selected.addClass("selected");
        }
        this.select.addClass("expanded");
        this.options.removeClass("hide");
        setTimeout(function() {
            me.options.removeClass("out");
        });
        return this;
    }

    fn.hide = function() {
        var me = this;
        this.select.removeClass("expanded");
        this.options.addClass("hide out");
        return this;
    }

    fn.initOptions = function() {
        var i = 0,
            len = this.data.length,
            html = "",
            tmp;
        for (; i < len; i++) {
            tmp = this.data[i];
            html += '<li class="imitation-item" data-value="' + tmp.value + '">' + tmp.text + '</li>';
        }
        this.options.html(html);
        return this;
    };  

    fn.selectOne = function(li) {
        li = $(li);
        var value = li.data("value");
        li.
             addClass("selected").
             siblings(".selected").
             removeClass("selected");
        if (value !== this.value) {
            this.value = value;
            this.selected = li;
            this.select.html(li.text());
            this.target.trigger("iselect.change", value);
        }
        this.hide();
    }

    fn.refresh = function(data) {
        this.data = data;
        this.value = "";
        this.select.html("");
        this.initOptions();
        return this;
    }

    fn.val = function() {
        return this.value;
    }

    fn.keyDown = function(evt) {
        var key = evt.key.toLowerCase(),
                up = {
                    "up": true, //ie
                    "arrowup": true
                },
                down = {
                    "down": true,//ie
                    "arrowdown": true
                },
                esc = {
                    "esc": true,//ie
                    "escape": true
                },
                options = this.options.children(),
                tmp;
            if (this.select.hasClass("expanded")) {
                tmp = this.options.find(".selected");
                if (key in up) {
                    if (tmp.length) {
                        tmp.removeClass("selected");
                        if (tmp.index() === 0) {
                            options.last().addClass("selected");
                        } else {
                            tmp.prev().addClass("selected");    
                        }
                    } else {
                        options.last().addClass("selected");
                    }
                } else if (key in down) {
                    tmp.removeClass("selected");
                    if (tmp.length) {
                        if (tmp.index() === options.length - 1) {
                            options.first().addClass("selected");
                        } else {
                            tmp.next().addClass("selected");    
                        }
                    } else {
                        options.first().addClass("selected");
                    }
                } else if (key === "enter") {
                    if (tmp.length) {
                        this.selectOne(tmp);
                    }
                } else if (key in esc) {
                    this.hide();                    
                }
            }
    }

    fn.initEvent = function () { 
        var me = this;
        this.select.on("click", function(evt) {
            if ($(this).hasClass("expanded")) {
                me.hide();
            } else {
                me.show();
            }
            evt.stopPropagation();
        });
        this.container.on("keydown", this.keyDown.bind(this));
        this.options.on("click", ".imitation-item", function() {
            me.selectOne(this);
        });
        $(document).on("click", function(evt) {
            var tgt = evt.target,
                con = me.select.get(0);
            //如果显示了选项,并且用户点击不在选择的div，或者其子元素上则关闭
            if (me.select.hasClass("expanded") && tgt !== con && !me.container.get(0).contains(tgt)) {
                me.hide();
            }
        });
        return this;
    }
    
    fn.init = function() {
        var con = $(doc.createElement("div")),
            select = $(doc.createElement("div")),
            options = $(doc.createElement("ul"));
        //tabindex 使得div能获取焦点
        con.addClass("imitation-select-container").attr("tabindex", -1);
        select.addClass("imitation-select");
        options.addClass("imitation-options hide out");
        this.container = con;
        this.select = select;
        this.options = options;
        con.append(select).append(options);
        this.target.append(con);
        return this.initOptions().initEvent();
    }

    function iSelect(con, method, data) {
        var ins,
            i = 0, 
            len = con.length,
            methodMap = {
                "init": true,
                "refresh": true,
                "val": true
            }, tmp;
        if (typeof method !== "string") {
            throw new Error("第一个参数不是字符串");
            return con;
        }
        if (!methodMap[method]) {
            console.warn("方法" + method + "不存在");
            return con;
        }
        if (method === "refresh" || method === "init") {
            if (!Array.isArray(data)) throw new Error("第二个参数不是一个数组");
        }
        if (method === "val") {
            ins = con.eq(0).data("isInstance");
            return ins ? ins.val() : null;
        }
        for (; i < len; i++) {
            tmp = con.eq(i);
            ins = tmp.data("isInstance");
            if (!ins) {
                if (method === "init") {
                    ins = new ImatitionSelect(tmp, data);
                    ins.init();
                    tmp.data("isInstance", ins);
                } else {
                    console.warn("请先调用init方法初始化");
                }
            } else {
                if (method !== "init") {
                    ins[method](data);
                } else {
                    console.warn("不能重复初始化,请调用refresh方法");
                }
            }
        }
        return con;
    }

    $.fn.extend({
        iSelect: function (method, data) {
            return iSelect(this, method, data);
         }
    });
 }();