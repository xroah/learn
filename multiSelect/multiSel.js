import Select from "./select";

export default class MultiSel extends Select {
    constructor(options) {
        super(options);
        this.value = [];
    }

    selectOne(el) {
        el.toggleClass("r-select-selected");
        this.changeValue(el);
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
                    </li>`;
            li = $(li.replace("{text}", tmp.text));
            li.data("value", tmp.value).attr("title", tmp.text);
            if (tmp.selected) {
                val.push(tmp.value);
                li.addClass("r-select-selected");
            }
            if (tmp.disabled) {
                li.addClass("r-select-disabled");
            }
            html.push(li);
        }
        return { val: val, html: html };
    }

    setText(val) {
        let len = val.length;
        if (len) {
            this.input.removeClass("r-select-placeholder").text(`已选中${len}项`);
        } else {
            this.input.addClass("r-select-placeholder").text(this.options.placeholder);
        }
    }
    
    val(val) {
        let lis = this.list.children();
        if (Array.isArray(val)) {
            this.value = [];
            for (let i = 0, len = lis.length; i < len; i++) {
                let tmp = lis.eq(i);
                if (val.indexOf(tmp.data("value")) > -1) {
                    this.value.push(tmp.data("value"));
                    tmp.addClass("r-select-selected");
                } else {
                    tmp.removeClass("r-select-selected");
                }
            }
        }
        this.setText(this.value);
        return this.value;
    }
}