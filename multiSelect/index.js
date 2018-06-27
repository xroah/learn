import "jquery";
import Select from "./core";
import "./index.scss";

const DEFAULT_CONFIG = {
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
                return instance[method](data);
            }
        }
    }
    return jqEl;
}

function init(jqEl, config) {
    for (let i = 0, len = jqEl.length; i < len; i++) {
        //防止重复初始化
        let instance = jqEl.eq(i).data("ms-instance");
        if (instance) continue;
        instance = new Select(config, jqEl[i]);
        jqEl.eq(i).data("ms-instance", instance);
    }
    return jqEl;
}

$.fn.extend({
    select: function (config, data) {
        let len = this.length;
        if (!len) return this;
        if (typeof config === "string") {
          return callMethod(this, config, data);
        } 
        if (!$.isPlainObject(config)) {
            config = DEFAULT_CONFIG;
        }
        config = {...DEFAULT_CONFIG, ...config};
        if (!Array.isArray(config.data)) {
            console.error("data不是数组");
            config.data = [];
        }
        return init(this, config);
    }
});