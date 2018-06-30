import "jquery";
import TextArea from "./textArea";

$.fn.extend({
    autoHeightTextArea: function (config) {
        for (let i = 0, len = this.length; i < len; i++) {
            let tmp = this.get(i);
            if (tmp.nodeName.toLowerCase() === "textarea") {
                new TextArea(config, this.eq(i));
            }
        }
        return this;
    }
});