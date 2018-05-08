
let uid = 0;
class Subject {
    constructor() {
        this.observers = [];
        this.id = uid++;
    }

    get(index) {
        return this.observers[index];
    }

    count() {
        return this.observers.length;
    }

    add(observer) {
        this.observers.push(observer);
    }

    removeByIndex(index) {
        this.observers.splice(index, 1);
    }

    remove(observer) {
        for (let i = 0, len = this.count(); i < len; i++) {
            if (this.get(i) === observer) {
                this.removeByIndex(i);
                break;
            }
        }
    }

    depend() {
        if (Subject.target) {
            Subject.target.addDep(this);
        }
    }

    notify(prop, val, oldVal) {
        for (let i = 0, len = this.count(); i < len; i++) {
            this.get(i).update(prop, val, oldVal);
        }
    }
}


class Observer {
    constructor(value) {
        this.value = value;
        this.walk(value);
    }

    walk(value) {
        let keys = Object.keys(value);
        for (let i = 0, len = keys.length; i < len; i++) {
            defineProperty(value, keys[i]);
        }
    }
}

function noop() {
    return function () {};
};

class Watcher {
    constructor(vm, exp, cb = noop()) {
        this.vm = vm;
        this.deps = [];
        this.depIds = new Set();
        this.exp = exp;
        this.cb = cb;
        Subject.target = this;
    }

    addDep(sub) {
        if (!this.depIds.has(sub.id)) {
            this.depIds.add(sub.id);
            sub.add(this);
            this.deps.push(sub);
        }
    }

    update(prop, val, oldVal) {
        if (typeof this.exp === "function") {
            this.exp(prop, val, oldVal);
        }
        this.cb.call(this.vm, val, oldVal);
    }
}

function defineProperty(obj, prop, val) {
    let property = Object.getOwnPropertyDescriptor(obj, prop);
    let getter = property.get;
    let sub = new Subject();
    if(arguments.length === 2) {
        val = obj[prop];
    }
    Object.defineProperty(obj, prop, {
        get() {
            let value = getter ? getter.get() : val;
            if (Subject.target) {
                sub.depend();
            }
            return value;
        },
        set(v) {
            let value = getter ? gettter.get() : val;
            if (value !== v) {
                sub.notify(prop, v, val);
                val = v;
            }
        }
    })
}

function initEvent(vm, el) {
    let tagName = el.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textArea") {
        el.addEventListener("input", function () {
            if (!this.ime) {
                let model = this.getAttribute("v-model");
                vm.$data[model] = this.value;
            }
        });
        el.addEventListener("compositionstart", function () {
            this.ime = true;
        });
        el.addEventListener("compositionend", function () {
            this.ime = false;
            let model = this.getAttribute("v-model");
            vm.$data[model] = this.value;
        });
    }
}

let models = {};
let views = {};

class DataBinding {
    constructor(options) {
        let subject = new Subject();
        this.$data = options.data;
        this.$el = document.querySelector(options.el);
        this.$options = options;
        this.init(options);
    }

    compile(root) {
        let children = root.children;
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            if (node.children.length) {
                this.compile(node);
            } else {
                if (node.hasAttribute("v-model")) {
                    let key = node.getAttribute("v-model");
                    if (!models[key]) models[key] = [];
                    models[key].push(node);
                    initEvent(this, node);
                    this.update(key, this.$data[key]);
                }
            }

        }
    }

    init(options) {
        new Watcher(this, this.update.bind(this));
        new Observer(options.data);
        this.compile(this.$el);
    }

    update(prop, val, oldVal, root) {
        root = root || this.$el;
        let reg = new RegExp("{{(" + prop + ")}}");
        let children = root.children;
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            if (node.hasAttribute("v-bind")) {
                if (node.getAttribute("v-bind") === prop) node.innerHTML = val;
            } else if(node.children.length) {
                this.update(prop, val, oldVal, node);
            } else {
                node = node.childNodes[0] || {}; 
                if (!views[prop]) views[prop] = [];
                if (reg.test(node.nodeValue)) {
                    views[prop].push(node);
                } 
                views[prop].forEach(function(node) {
                    node.nodeValue = val;
                });
            }
        }
        models[prop].forEach(function(input) {
            input.value = val;
        });
    }

}

let data = {
    model: 1,
    model1: 2
};

new DataBinding({
    el: "#app",
    data
});

