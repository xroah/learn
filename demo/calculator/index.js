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

/**
 * 如33+10 split后为["3", "3", "+", "1", "0"]
 * 处理表达式split后的数组,将分割后的整数/小数还原为原来数
 * @param {Array} 表达式split后的的字符串数组 
 */
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
        //当前字符为数字
        if (!charMap[char]) {
            //结果数组中最后一个运算符或者括号则直接将pop出来的字符和当前字符push回去
            //否则拼接上当前字符再push回去
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


/**
 * 中缀表达式转换为后缀表达式法则：
 * 1、如果遇到数字，我们就直接将其输出。
 * 2、如果遇到非数字时，若栈为空或者该符号为左括号或者栈顶元素为括号，直接入栈。
 * 3、如果遇到一个右括号，持续出栈并输出符号，直到栈顶元素为左括号，
 * 然后将左括号出栈（注意，左括号只出栈，不输出），右括号不入栈
 * 4、如果遇到运算符号且栈非空，查看栈顶元素，如果栈顶元素的运算优先级大于或者等于该运算符号，
 * 则持续出栈，直到栈顶元素优先级小于该运算符。最后将该元素入栈
 * 5、如果我们读到了输入的末尾，则将栈中所有元素依次弹出。
 * @param {string} exp 要转换的表达式 
 */
function convertExpression(exp) {
    let _exp = exp.replace(/\s+/g, "").split(""); //去掉表达式多余的空格
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

/**
 * 后缀表达式求值
 * 从左到右扫描后缀表达式
 * 遇到运算符就把表达式中该运算符前面两个操作数取出并运算，然后把结果带回后缀表达式
 * ；继续扫描直到后缀表达式最后一个表达式。
 * @param {string} 待求值的表达式 
 */
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

let exp = "39 +((3-1) + 2*3)*3+6/2";

let result = calc(exp);

console.log("表达式结果=>", result);