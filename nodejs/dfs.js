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

dfs(obj);