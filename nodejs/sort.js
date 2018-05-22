let arr = [];

for (let i = 0; i < 10000; i++) {
    arr.push(Math.random() * 100000 >>> 0);
}

function bubbleSort(arr) {
    let copy = arr.slice();
    let len = copy.length;
    for (let i = 0; i < len; i++) {
        for (let j = len - 1; j > 0; j--) {
            if (copy[j] < copy[j - 1]) {
                copy[j - 1] = [copy[j], copy[j] = copy[j - 1]][0];
            }
        }
    }
    return copy;
}

function insertionSort(arr) {
    let copy = arr.slice();
    for (let i = 1, len = copy.length; i < len; i++) {
        let tmp = copy[i];
        let j = i - 1;
        while (j >= 0 && copy[j] > tmp) {
            copy[j + 1] = copy[j];
            j--;
        }
        copy[j + 1] = tmp;
    }
    return copy;
}

function quickSort(arr){
    let copy = arr.slice();
    let len = copy.length;
    if (len <= 1) return arr; 
    let pivot = copy[0];
    let left = [];
    let right = [];
    for (let i = 1; i < len; i++) {
        let tmp = copy[i];
        tmp <= pivot ? left.push(tmp) : right.push(tmp);
    }
    return quickSort(left).concat(pivot, quickSort(right));
}


console.time("冒泡");
bubbleSort(arr);
console.timeEnd("冒泡");

console.time("插入");
insertionSort(arr);
console.timeEnd("插入");

console.time("快速");
console.log(quickSort(arr));
console.timeEnd("快速");
