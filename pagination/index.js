import "jquery";
import Pagination from "./pagination";
import "./index.scss";

$.fn.extend({
    pagination(config, arg) {
        let api = {
            jumpTo: true,
            getCurrentPage: true,
            destroy: true
        };
        let hasReturnValueFunc = {
            getCurrentPage: true
        };
        let instance;
        let instanceKey = "page-instance";
        if (typeof config === "string") {
            if (!(config in api)) return this;
            for (let i = 0, len = this.length; i < len; i++) {
                instance = this.eq(i).data(instanceKey);
                if (!instance) continue;
                if (config in hasReturnValueFunc) {
                    return instance[config](arg);
                }
                instance[config](arg);
            }
            return this;
        } 
        for (let i = 0, len = this.length; i < len; i++) {
            let tmp = this.eq(i);
            instance = tmp.data(instanceKey);
            if (!instance) {
                instance = new Pagination(config, tmp);
                tmp.data(instanceKey, instance);
            }
        }
        return this;
    }
});