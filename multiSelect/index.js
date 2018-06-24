import "jquery";
import Select from "./select";
import MultiSel from "./multiSel";
import "./index.scss";

$.fn.extend({
    select: function (options) {
        var i = 0,
            len = this.length,
            instance,
            hasReturnValueFunc = {
                val: true
            };
        if (!len) throw new Error("没有选中元素");
        if (typeof options === "string") {
            for (; i < len; i++) {
                instance = this.eq(i).data("ms-instance");
                if (instance) {
                    if (!(options in hasReturnValueFunc)) {
                        instance[options]();
                    } else {
                        return instance[options]();
                    }
                }
            }
        } else {
            for (; i < len; i++) {
                //防止重复初始化
                instance = this.eq(i).data("ms-instance");
                if (instance) continue;
                if (this[i].multiple) {
                    instance = new MultiSel(options);
                } else {
                    instance = new Select(options);
                }
                this.eq(i).data("ms-instance", instance);
                instance.init(this[i]);
            }
        }
        return this;
    }
});