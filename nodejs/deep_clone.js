var obj = {
    a: 123,
    b: 232,
    c: {
        df: 545,
        fd: 763,
        d: {
            df: 35464,
            jd: 3434,
            dld: 454,
            e: {
                DF: 1214,
                m: {
                    def: 485
                }
            }
        }
    },
    f: 454,
    g: {
        er: 4554,
    }
};

function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}

function cloneObject(source, target) {
    var key;
    target = target || {};
    for (key in obj) {
        target[key] = obj[key];
    }
    return target;
}

function clone(target, source, deep) {
    var aLen = arguments.length,
        key, src, copy;
    if (aLen === 3) {
        if (!isObject(target)) {
            target = {};
        }
        if (isObject(source)) {
            if (deep) {
                for (key in source) {
                    src = source[key];
                    copy = target[key] || {};
                    if (copy === src) continue;
                    if (isObject(src)) {
                        target[key] = clone(copy, src, true);
                    } else {
                        target[key] = src;
                    }
                }
            } else {
                target = cloneObject(source, target);
            }
        }
    } else if (aLen === 2) {
        if (isObject(target)) {
            if (isObject(source)) {
                target = cloneObject(source, target);
            } else if (!!source) {
                target = clone(target, source, true);
            }
        }
    } else {
        if (isObject(target)) {
            target = cloneObject(target);
        }
    }
    return target;
};

console.log(obj)
var target = clone({g: {hahaha: "哈哈哈"}}, obj, true);
console.log(target)

console.log(obj.c === target.c)