function curry(fn) {
    let args = Array.prototype.slice.call(arguments, 1);
    return function inside() {
        let _args = args.concat(Array.prototype.slice.call(arguments));
        if (arguments.length) {
            args = _args;
            return inside;
        } 
        return fn.apply(this, _args);
    }
}

function add() {
    let args = Array.prototype.slice.call(arguments);
    return args.reduce(function(prev, cur) {
        return prev + cur;
    });
}

let sum = curry(add);

console.log(sum(2)(3)(11)(5)())