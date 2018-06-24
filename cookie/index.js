const cookie = {},
    doc = document;

function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}

function convertExpires(expires) {
    if (!expires) return '';
    var ms = new Date(expires),
        type = typeof expires,
        now = new Date().getTime();
    //传入的是一个数字表示过期的天数
    //传入一个字符串当日期字符串处理
    return type === "number" ? new Date(now + expires * 8.64e+7).toGMTString() :
        //传入的可能不是合法的日期格式，返回的是Invalid Date, +ms则返回NaN
        type === "string" ? (+ms ? ms.toGMTString() : "") :
            expires instanceof Date ? expires.toGMTString() : "";
}

cookie.encode = encodeURIComponent;

cookie.decode = decodeURIComponent;

cookie.set = function (key, value, config) {
    let k = this.encode(String(key).trim()),
        v = this.encode(JSON.stringify(value === undefined ? "" : value)),
        cookie;
    if (!k.length) {
        console.warn("key不能为空");
        return;
    }
    cookie = k + "=" + v + ";";
    if (isObject(config)) {
        cookie += "path=" + (config.path || "/") + ";" +
            "expires=" + convertExpires(config.expires) + ";" +
            "domain=" + (config.domain || doc.domain);
    }
    doc.cookie = cookie;
}

function operateAllCookie(thisArg, remove) {
    let result = {},
        cookie = document.cookie;
    cookie = cookie ? cookie.split(";") : [];
    cookie.forEach(ck => {
        let tmp;
        ck = thisArg.decode(ck.trim());//分号后面有一个空格
        tmp = ck.split("=");
        if (remove) {
            thisArg.set(tmp[0], "", { expires: -1 });
        } else {
            try {
                tmp[1] = JSON.parse(tmp[1]);
            } catch (e) { }
            result[tmp[0]] = tmp[1];
        }
    });
    return result;
}

cookie.get = function (key) {
    let k = String(key).trim(),
        result;
    if (!k) return;
    result = operateAllCookie(this);
    //允许用undefined, null, 0, NaN等作为key
    return arguments.length ? result[k] : result;
}

cookie.remove = function (key) {
    arguments.length ?
        (this.get(key) && this.set(key, "", { expires: -1 })) :
        operateAllCookie(this, true);
}

module.exports = cookie;