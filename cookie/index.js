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
        //JSON parse "undefined"会报错, "null"能正常解析
        v = this.encode(JSON.stringify(value === undefined ? "" : value)),
        cookie;
    if (!k.length) {
        console.error("key不能为空");
        return;
    }
    cookie = k + "=" + v + ";";
    if (isObject(config)) {
        let path = location.pathname;
        let slashIndex = path.lastIndexOf("/");
        path = path.substring(0, slashIndex);
        cookie += `path=${config.path || path};expires=${convertExpires(config.expires)};domain=${config.domain || doc.domain};`;
    }
    doc.cookie = cookie;
}

cookie.get = function (key) {
    let k = String(key).trim();
    let result = {};
    let cookie = document.cookie;
    cookie = cookie ? cookie.split(";") : [];
    for (let i = cookie.length; i--;) {
        let tmp = this.decode(cookie[i].trim());//分号后面有一个空格
        tmp = tmp.split("=");
        try {
            tmp[1] = JSON.parse(tmp[1]);
        } catch (e) {}
        result[tmp[0]] = tmp[1];
    }
    //允许用undefined, null, 0, NaN等作为key
    //根据是否传入arguments来判断
    return arguments.length ? result[k] : result;
}

cookie.remove = function (key) {
    let val = this.get(key);
    arguments.length && (val !== undefined) && this.set(key, "", {
        expires: -1
    });
}

module.exports = cookie;