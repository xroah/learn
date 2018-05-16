const utils = require("./utils");

function bfs(obj) {
    let {keys, values} = utils.getObjectKeysAndValues(obj);
    while(keys.length) {
        let key = keys.shift();
        let value = values.shift();
        if (utils.isObject(value)) {
            let tmp = utils.getObjectKeysAndValues(value);
            keys = keys.concat(tmp.keys);
            values = values.concat(tmp.values);
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
console.time("遍历");
bfs(obj);
console.timeEnd("遍历")