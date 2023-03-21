let arr = [];

for (let i = 0; i < 100000; i++) {
    arr.push(Math.random() * 100000 >>> 0);
}

function bubbleSort(arr) {
    let copy = arr.slice();
    let len = copy.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (copy[j] > copy[j + 1]) {
                copy[j + 1] = [copy[j], copy[j] = copy[j + 1]][0];
            }
        }
    }
    return copy;
}

function selectionSort(arr) {
    let copy = arr.slice();
    let len = copy.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            if (copy[i] > copy[j]) {
                [copy[i], copy[j]] = [copy[j], copy[i]];
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

function quickSort1(arr){
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
    return quickSort1(left).concat(pivot, quickSort1(right));
}


function quickSort2(arr, left, right) {
    let pivot = arr[left];
    let i = left;
    let j = right;
    if (left > right) {
        return arr;
    }
    while(i != j) {
        while(arr[j] >= pivot && i < j) {
            j--;
        }
        while(arr[i] <= pivot && i < j) {
            i++;
        }
        if (i < j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[left], arr[i]] = [arr[i], arr[left]];
    quickSort2(arr, left, i - 1);
    quickSort2(arr, i + 1, right);
}

console.time("冒泡");
bubbleSort(arr);
console.timeEnd("冒泡");

console.time("选择");
selectionSort(arr);
console.timeEnd("选择");

console.time("插入");
insertionSort(arr);
console.timeEnd("插入");

console.time("快速1");
quickSort1(arr);
console.timeEnd("快速1");

console.time("快速2");
let copy = arr.slice();
quickSort2(copy, 0, copy.length - 1);
console.timeEnd("快速2");

