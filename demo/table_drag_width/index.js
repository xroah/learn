! function () {
    function addCursor(table) {
        table = $(table);
        let height = table.height();
        let tr = table.find("tr").eq(0);
        let tds = tr.find("th");
        let span = $(document.createElement("span"));
        span.addClass("resize");
        if (!tds.length) {
            tds = tr.find("td");
        }
        //最后一个td不加resize
        for (let i = 0, len = tds.length - 1; i < len; i++) {
            let tmp = tds.eq(i);
            //如果不设置列的宽度，拖动时前面几列宽度会跟着变化
            //拖动列后宽度正常 
            if (i === 0) {
                ;
            }
            tmp.css({
                width: tmp.width(),
                position: "relative"
            }).append(span.clone());
        }
        let baseMark = $(document.body).children(".base-mark");
        if (!baseMark.length) {
            baseMark = $(document.createElement("div"));
            baseMark.addClass("base-mark").css("height", height);
            $(document.body).append(baseMark);
        }
    }

    function tableDragWidth(table) {
        if (table) {
            if (table.nodeName && table.nodeName.toLowerCase() === "table") {
                addCursor(table);
            }
        }
    }

    function init(table) {
        $(table).on("mousedown", ".resize", function (evt) {
            let baseMark = $(document.body).children(".base-mark");
            let startX = evt.clientX;
            let rect = this.getBoundingClientRect();
            let resize = $(this);
            //鼠标左键evt.button 为0
            if (evt.button) return;
            $(table).css("cursor", "col-resize");
            baseMark.css({
                left: startX,
                top: rect.top,
                height: $(table).height()
            }).show();
            let mouseMove = function (evt) {
                baseMark.css({
                    left: evt.clientX
                });
            };
            let mouseUp = function (evt) {
                let dis = evt.clientX - startX;
                let td = resize.parent();
                td.css("width", td.width() + dis);
                $(table).off("mousemove", mouseMove).css("cursor", "default");
                baseMark.hide();
            }
            $(table).on("mousemove", mouseMove);
            $(document.body).one("mouseup", mouseUp);
            console.log("mousedown")
        }).css("table-layout", "fixed");
        tableDragWidth(table);
    }

    $.fn.extend({
        tableDragWidth() {
            return this.each(function () {
                init(this);
            });
        }
    });
}();

$(".drag-table").tableDragWidth();