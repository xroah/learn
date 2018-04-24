!function () { 
    function ImatitionSelect(appendTo,data) {
        this.container = appendTo;
        this.selected = null;
        this.value = "";
        this.data = data;
    }
    
    var fn = ImatitionSelect.prototype,
        doc = document;
    
    fn.show = function() {
        var me = this;
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
            this.select.html(li.text());
            $(this.container).trigger("iselect.change", value);
        }
        this.hide();
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
        this.options.on("click", ".imitation-item", function() {
            me.selectOne(this);
        });
        $(document).on("click", function(evt) {
            var tgt = evt.target,
                con = me.select.get(0);
            //如果显示了选项,并且用户点击不在选择的div，或者其子元素上则关闭
            if (me.select.hasClass("expanded") && tgt !== con && !me.container.contains(tgt)) {
                me.hide();
            }
        });
        return this;
    }
    
    fn.init = function() {
        var con = $(doc.createElement("div")),
            select = $(doc.createElement("div")),
            options = $(doc.createElement("ul"));
        con.addClass("imitation-select-container");
        select.addClass("imitation-select");
        options.addClass("imitation-options hide out");
        this.select = select;
        this.options = options;
        con.append(select).append(options);
        $(this.container).append(con);
        return this.initOptions().initEvent();
    }
    $.fn.extend({
        iSelect: function (data) {
            this.each(function() {
                new ImatitionSelect(this, data).init();
            }); 
            return this;
         }
    });
 }();