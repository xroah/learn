import "jquery";
import Select from "./core";
import "./index.scss";

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
        let api = {
            open: true,
            close: true,
            disable: true,
            enable: true,
            val: true,
            destroy: true
        };
        if (!len) return this;
        if (typeof config === "string") {
          if (config in api) {
            return callMethod(this, config, data);
          }
          return this;
        } 
        return init(this, config);
    }
});