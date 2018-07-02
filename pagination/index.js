import "jquery";
import Pagination from "./pagination";
import "./index.scss";

$.fn.extend({
    pagination(config) {
        for (let i = 0, len = this.length; i < len; i++) {
            new Pagination(config, this.eq(i));
        }
        return this;
    }
});