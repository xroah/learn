import Select from "./select";

export default class MultiSel extends Select {
    constructor(options) {
        super(options);
        this.value = [];
    }

    initEvent() {
        let _this = this;
        super.initEvent();
        this.list.off("click").on("click", "li", function () {
            if ($(this).hasClass("r-select-disabled")) return;
            let $this = $(this);
            $this.toggleClass("r-select-selected");
            _this.changeValue($this);
        });
    }

    changeValue(li) {
        let val = this.value.slice(0);
        let value = li.data("value");
        if (li.hasClass("r-select-selected")) {
            val.push(value);
        } else {
            let index = val.indexOf(value);
            val.splice(index, 1);
        }
        this.setText(this.value = val);
    }

    initOptionsByData(data) {
        let html = [],
            val = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let tmp = data[i];
            let li = `<li>
                            <span class="r-checkbox-wrapper">
                                <span class="r-checkbox-outer"></span>
                                <span>{text}</span>
                            </span>
                    </li>`
            li = $(li.replace("{text}", tmp.text));
            li.data("value", tmp.value).attr("title", tmp.text);
            if (tmp.selected) {
                val.push(tmp.value);
                li.addClass("r-select-selected")
            }
            if (tmp.disabled) {
                li.addClass("r-select-disabled");
            }
            html.push(li);
        }
        return { val: val, html: html }
    }

    setText(val) {
        let len = val.length;
        if (len) {
            this.input.removeClass("r-select-placeholder").text(`已选中${len}项`);
        } else {
            this.input.addClass("r-select-placeholder").text(this.options.placeholder);
        }
    }
}