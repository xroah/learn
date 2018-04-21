function Subject() {
    this.observers = [];
}

Subject.prototype.add = function(observer) {
    this.observers.push(observer);
}

Subject.prototype.removeByIndex = function(index) {
    this.observers.splice(index, 1);
}

Subject.prototype.remove = function(observer) {
    for (let i = 0, len = this.count; i < len; i++) {
        if (this.get(i) === observer) {
            this.removeByIndex(i);
            break;
        }
    }
}

Subject.prototype.get = function(index) {
    return this.observers[index];
}

Subject.prototype.count = function() {
    return this.observers.length;
}

Subject.prototype.notify = function(context) {
    for (let i = 0, len = this.count(); i < len; i++) {
        this.get(i).update(context);
    }
}

const data = {};

let str = "";


var subject = new Subject();


subject.add(new Observer1());
subject.add(new Observer2())

Object.defineProperty(data, "model", {
    get: function() {
        return str;
    },
    set: function(val) {
        if (val !== str) {
            str = val;
            subject.notify(val);
        }
    }
});


function Observer1() {

}

Observer1.prototype.update = function(value) {
    let div = document.getElementById("value");
    div.innerHTML = value;

}

function Observer2() {

}

Observer2.prototype.update = function(value) {
    let input = document.getElementById("input");
    input.value = value;
}

let input = document.getElementById("input");

input.addEventListener("input", () => {
    data.model = input.value;
});