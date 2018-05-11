function Stack() {
    this.data = [];
    this.top = 0;
}

Stack.prototype = {
    constructor: Stack,
    push(item) {
        this.top++;
        return this.data.push(item);
    },
    pop() {
        this.top--;
        return this.data.pop();
    },
    peek() {
        return this.data[this.top - 1];
    },
    size() {
        return this.top;
    },
    clear() {
        this.top = 0;
        this.data = [];
    },
    toString() {
        return this.data.toString();
    },
    isEmpty() {
        return this.top === 0;
    }
};

function handleExpArray(expArr) {
    let result = [];
    let charMap = {
        "+": true,
        "-": true,
        "*": true,
        "/": true,
        "(": true,
        ")": true
    };
    for (let i = 0, len = expArr.length; i < len; i++) {
        let char = expArr[i];
        let tmp = result.pop() || "";
        if (!charMap[char]) {
            if (charMap[tmp]) {
                result.push(tmp, char);
            } else {
                result.push(tmp + char);
            }
        } else {
            result.push(tmp, char);
        }
    }
    return result;
}

function convertExpression(exp) {
    let _exp = exp.replace(/\s+/g, "").split("");
    _exp = handleExpArray(_exp);
    let result = [];
    let stack = new Stack();
    let priority = {
        "+": 0,
        "-": 0,
        "*": 1,
        "/": 1
    };
    let reg = /\d/;
    for (let i = 0, len = _exp.length; i < len; i++) {
        let char = _exp[i];
        if (reg.test(char)) {
            result.push(char);
        } else {
            let peek = stack.peek();
            if (char === "(") {
                stack.push(char);
            } else if (char === ")") {
                let tmp = stack.pop();
                while (tmp !== "(") {
                    result.push(tmp);
                    tmp = stack.pop();
                }
            } else {
                if (peek in priority) {
                    while (priority[stack.peek()] >= priority[char]) {
                        result.push(stack.pop());
                    }
                    stack.push(char);
                } else {
                    stack.push(char);
                }
            }
        }
    }
    while (!stack.isEmpty()) {
        result.push(stack.pop());
    }
    return result;
}

function add(a, b) {
    return a + b;
}

function minus(a, b) {
    return a - b;
}

function times(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function calc(exp) {
    let ret = convertExpression(exp);
    let stack = new Stack();
    let reg = /\d/;
    for (let i = 0, len = ret.length; i < len; i++) {
        let char = ret[i];
        if (reg.test(char)) {
            stack.push(char);
        } else {
            let num1 = +stack.pop();
            let num2 = +stack.pop();
            let result;
            switch (char) {
                case "+":
                    result = add(num2, num1);
                    break;
                case "-":
                    result = minus(num2, num1);
                    break;
                case "*":
                    result = times(num2, num1);
                    break;
                case "/":
                    result = divide(num2, num1);
                    break;
            }
            stack.push(result);
        }
    }
    return stack.pop();
}

let exp = "39 +(3-1)*3+6/2";

let result = calc(exp);

console.log("表达式结果=>", result);