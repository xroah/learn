//display: none;不能获取到高度，visiblity:hidden可以
const BASE_STYLE = [
    "min-height: 0 !important;",
    "height: 0 !important;",
    "max-height: 0 !important;",
    "visibility: hidden !important;",
    "overflow: hidden !important;",
    "position: absolute !important;",
    "z-index: -1000 !important;",
    "top: 0 !important;",
    "left: 0 !important;"
].join("");
const OTHER_STYLE = [
    "letter-spacing",
    "line-height",
    "padding-top",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "border-top",
    "border-right",
    "border-bottom",
    "border-left",
    "font-family",
    "font-weight",
    "font-size",
    "text-rendering",
    "text-transform",
    "width",
    "text-indent",
    "box-sizing",
];

let hiddenTextArea;

function calcStyle(ta) {
    let computedStyle = getComputedStyle(ta);
    let style = OTHER_STYLE.map(
        name => `${name}:${computedStyle.getPropertyValue(name)};`
    ).join("");
    let boxSizing = computedStyle.getPropertyValue("box-sizing");
    let paddingSize = (
        parseFloat(computedStyle.getPropertyValue("padding-top")) +
        parseFloat(computedStyle.getPropertyValue("padding-bottom"))
    );
    let borderSize = (
        parseFloat(computedStyle.getPropertyValue("border-top-width")) +
        parseFloat(computedStyle.getPropertyValue("border-bottom-width"))
    );
    return {
        style,
        boxSizing,
        paddingSize,
        borderSize
    }
}

export default function calcHeight(ta, minRows, maxRows) {
    let {style, boxSizing, paddingSize, borderSize} = calcStyle(ta);
    if (!hiddenTextArea) {
        hiddenTextArea = document.createElement("textarea");
        document.body.appendChild(hiddenTextArea);
    }
    hiddenTextArea.style.cssText = `${BASE_STYLE}${style}`;
    hiddenTextArea.value = ta.value || ta.placeholder || "";
    let height = hiddenTextArea.scrollHeight;
    let minHeight = Number.MIN_SAFE_INTEGER
    let maxHeight = Number.MAX_SAFE_INTEGER;
    let overflowY;
    if (boxSizing === "border-box") {
        height += borderSize;
    } else if (boxSizing === "content-box") {
        //scrollHeight 包含padding
        height -= paddingSize;
    }
    if (minRows || maxRows) {
        hiddenTextArea.value = " ";
        let singleRowHeight = hiddenTextArea.scrollHeight - paddingSize;
        if (typeof minRows === "number") {
            minHeight = singleRowHeight * minRows;
            if (boxSizing === "border-box") {
                minHeight += paddingSize + borderSize;
            }
            height = Math.max(minHeight, height);
        }
        if (typeof maxRows === "number") {
            maxHeight = singleRowHeight * maxRows;
            if (boxSizing === "border-box") {
                maxHeight += paddingSize + borderSize;
            }
            overflowY = height > maxHeight ? "" : "hidden";
            height = Math.min(maxHeight, height);
        } 
    }
    if (!maxRows) {
        //IE/edge下会出现滚动条
        overflowY = "hidden";
    }
    return {
        height, minHeight, maxHeight, overflowY
    };
}