import calcHeight from "./calcTextAreaHeight";

export default class AutoHeightTextArea {
    constructor(config, el) {
        if (!$.isPlainObject(config)) {
            config = {};
        }
        this.config = config;
        this.el = el;
        this.initEvent();
    }

    onInput() {
        let { minRows, maxRows } = this.config;
        let {
            height,
            minHeight,
            maxHeight,
            overflowY
        } = calcHeight(this.el.get(0), minRows, maxRows);
        this.el.css({
            height,
            minHeight,
            maxHeight,
            overflowY
        });
        console.log(height)
    }

    isIE9() {
        let reg = /msie\s*9.0/i;
        return reg.test(navigator.userAgent);
    }

    ie9KeyDown(evt) {
        let key = evt.key.toLowerCase();
        if (
            key === "backspace" ||
            key === "del" ||
            evt.ctrlKey //IE9 ctrl + z, ctrl + y,不会触发input
        ) {
            //当IE9下，当最后一行是空行,退格回到上一行时候,计算出来的值包含最后一行
            //加上setTimeout使计算结果准确
            setTimeout(() => {
                this.onInput();
            }, 20)
        }
    }

    initEvent() {
        let input = this.onInput.bind(this);
        this.el.on("input", input);
        if (this.isIE9()) {
            this.el
                .on("keydown", this.ie9KeyDown.bind(this))
                .on("cut", input);
        }
    }
}