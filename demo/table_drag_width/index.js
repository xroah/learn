! function () {
    function addCursor(table) {
        table = $(table);
        let height = table.height();
        table.hide();
        let tr = table.find("tr").eq(0);
        let tds = tr.find("th");
        if (!tds.length) {
            tds = tr.find("td");
        }
        //最后一个td不加resize
        for (let i = 0, len = tds.length - 1; i < len; i++) {
            let span = $(document.createElement("span"));
            span.addClass("resize");
            tds.eq(i).css("position", "relative").append(span);
        }
        let baseMark = $(document.body).children(".base-mark");
        if (!baseMark.length) {
            baseMark = $(document.createElement("div"));
        baseMark.addClass("base-mark").css("height", height);
        $(document.body).append(baseMark);
        }
        table.show();
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
            baseMark.css({
                left: startX,
                top: rect.top,
                height: $(table).height()
            }).show();
            let mouseMove = function(evt) {
                baseMark.css({
                    left: evt.clientX
                });
            };
            let mouseUp = function (evt) {
                let dis = evt.clientX - startX;
                let td = resize.parent();
                td.css("width", td.width() + dis);
                $(table).off("mousemove", mouseMove);
                baseMark.hide();
            }
            $(table).on("mousemove", mouseMove);
            $(document.body).one("mouseup", mouseUp);
             console.log("mousedown")
         });
         tableDragWidth(table);
    }

    $.fn.extend({
        tableDragWidth() {
            return this.each(function() {
                init(this);
            });
        }
    });
}();

$(".drag-table").tableDragWidth();