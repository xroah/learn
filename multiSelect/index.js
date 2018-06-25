import "jquery";
import Select from "./select";
import MultiSel from "./multiSel";
import "./index.scss";

const DEFAULT_OPTIONS = {
    data: [],
    multiple: false,
    placeholder: ""
};

function callMethod(jqEl, method) {
    let hasReturnValueFunc = {
        val: true
    };
    for (let i = 0, len = jqEl.length; i < len; i++) {
        let instance = jqEl.eq(i).data("ms-instance");
        if (instance) {
            if (!(options in hasReturnValueFunc)) {
                instance[options]();
            } else {
                return instance[options]();
            }
        }
    }
}

function init(jqEl, options) {
    for (let i = 0, len = jqEl.length; i < len; i++) {
        //防止重复初始化
        let instance = jqEl.eq(i).data("ms-instance");
        if (instance) continue;
        //多选
        if (jqEl[i].multiple || options.multiple) {
            instance = new MultiSel(options);
        } else {
            instance = new Select(options);
        }
        jqEl.eq(i).data("ms-instance", instance);
        instance.init(jqEl[i]);
    }
}

$.fn.extend({
    select: function (options) {
        let len = this.length;
        if (!len) throw new Error("没有选中元素");
        if (!$.isPlainObject(options)) {
            options = DEFAULT_OPTIONS;
        }
        options = {...DEFAULT_OPTIONS, ...options};
        if (!Array.isArray(options.data)) {
            throw new Error("data不是数组");
        }
        if (typeof options === "string") {
            callMethod(this, options);
        } else {
            init(this, options);
        }
        return this;
    }
});