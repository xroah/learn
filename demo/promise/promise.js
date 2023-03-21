const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function CustomPromise(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("Promise resolver undefined is not a function");
    }
    if (new.target === undefined) {
        throw new TypeError("undefined is not a promise");
    }

    let _this = this;
    let status = PENDING;

    def(this, "status", status, true);

    let resolve = function () {
        if (status !== PENDING) return;
        status = FULFILLED;
        def(_this, "status", status, false);

        setTimeout(() =>　{
            
        });
        console.log("resolved")
    };

    this.resolvedCallbacks = [];
    this.rejectedCallbacks = [];

    let reject = function (reason) {
        if (status !== PENDING) return;
        status = REJECTED;
        def(_this, "status", status, false);
        def(_this, "reason", reason, false);
        setTimeout(() => {
            
        });
    }

    fn(resolve, reject);
}

CustomPromise.prototype.then = function (onFulfilled, onRejected) {
    
}

CustomPromise.prototype.catch = function () {

}

CustomPromise.prototype.finally = function () {

}

function def(obj, prop, value, configurable) {
    Object.defineProperty(obj, prop, {
        value,
        configurable
    });
}


