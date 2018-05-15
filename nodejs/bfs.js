function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]"
}

function bfs(obj) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    while(keys.length) {
        let key = keys.shift();
        let value = values.shift();
        if (isObject(value)) {
            keys = keys.concat(Object.keys(value));
            values = values.concat(Object.values(value));
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
        g: 7
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

bfs(obj);