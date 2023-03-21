var TPL = "@keyframes {{name}} {" +
    "0% {" +
    "transfrom: rotate({{start}}deg);" +
    "}" +
    "100% {" +
    "transform: rotate({{end}}deg);" +
    "}" +
    "}";
var clock = {
    doc: document,
    rotate: function (el, deg) {
        el.style.transform = "rotate(" + deg + "deg)";
        return this;
    },
    getByCls: function (cls) {
        return this.doc.getElementsByClassName(cls)[0];
    },
    createScale: function (count, cls, frag, fn) {
        var i = 0,
            div = this.doc.createElement("div"),
            node;
        div.classList.add(cls);
        for (; i < count; i++) {
            node = div.cloneNode(false);
            fn(node, i);
            frag.appendChild(node);
        }
        return this;
    },
    initCurrentTime: function () {
        var date = new Date(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourHand = this.getByCls("hour-hand"),
            minHand = this.getByCls("minute-hand"),
            secondHand = this.getByCls("second-hand"),
            html = "";
        hour = 30 * hour + Math.ceil(0.5 * minute);
        minute = 6 * minute + Math.ceil(0.1 * second);
        second *= 6;
        date = this.doc.createElement("style");
        [{
            name: "tick-tock-hour",
            start: hour
        }, {
            name: "tick-tock-minute",
            start: minute
        }, {
            name: "tick-tock-second",
            start: second
        }].forEach(function (item) {
            html += TPL.replace("{{name}}", item.name).
                replace("{{start}}", item.start).
                replace("{{end}}", item.start + 360);
        });
        date.innerHTML = html;
        document.head.appendChild(date);
        this.rotate(secondHand, second).
            rotate(minHand, minute).
            rotate(hourHand, hour);
    },
    init: function () {
        var container = this.getByCls("clock-container"),
            frag = this.doc.createDocumentFragment(),
            self = this;
        this.createScale(12, "per-hour", frag, function (node, i) {
            self.rotate(node, i * 30);
        }).createScale(60, "per-second", frag, function (node, i) {
            if (i % 5 < 4) {
                self.rotate(node, (i + 1) * 6);
            }
        }).initCurrentTime(frag);
        container.appendChild(frag);
    }
};

clock.init();