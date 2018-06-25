import "jquery";
import Select from "./select";
import MultiSel from "./multiSel";
import "./index.scss";

const DEFAULT_OPTIONS = {
    data: [],
    multiple: false,
    placeholder: ""
};

function callMethod(jqEl, method, data) {
    let hasReturnValueFunc = {
        val: true
    };
    for (let i = 0, len = jqEl.length; i < len; i++) {
        let instance = jqEl.eq(i).data("ms-instance");
        if (instance) {
            if (!(method in hasReturnValueFunc)) {
                instance[method](data);
            } else {
                return instance[method]();
            }
        }
    }
    return jqEl;
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
    return jqEl;
}

$.fn.extend({
    select: function (options, data) {
        let len = this.length;
        if (!len) return this;
        if (typeof options === "string") {
          return callMethod(this, options, data);
        } 
        if (!$.isPlainObject(options)) {
            options = DEFAULT_OPTIONS;
        }
        options = {...DEFAULT_OPTIONS, ...options};
        if (!Array.isArray(options.data)) {
            throw new Error("data不是数组");
        }
        return init(this, options);
    }
});