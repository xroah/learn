const utils = require("./utils");

function dfs(obj) {
    for (let key in obj) {
        let tmp = obj[key];
        if (utils.isObject(tmp)) {
            dfs(tmp);
        } else {
            console.log(`${key}=>${tmp}`);
        }
    }
}


function loopDfs(obj) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    while(keys.length) {
        let key = keys.shift();
        let value = values.shift();
        if (utils.isObject(value)) {
            keys = Object.keys(value).concat(keys);
            values = Object.values(value).concat(values);
        } else {
            console.log(`${key}=>${value}`);
        }
    }
}

let obj = {
    a: 1,
    b: 3,
    c: {
        d: 4,
        e: 5
    },
    f: {
        g: 7,
        l: {
            o: 23,
            p: {
                u: 42,
                w: 28
            }
        }
    },
    h: {
        m: 10,
        j: {
            k: 11,
            i: 13,
            x: {
                y: 20,
                z: 21
            }
        }
    }
};
console.log("---------递归----------");
dfs(obj);
console.log("---------循环----------");
loopDfs(obj);