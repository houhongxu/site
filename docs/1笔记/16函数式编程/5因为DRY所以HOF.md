# 因为 DRY 所以 HOF

## 是什么

- DRY(Don't Repeat Yourself)是一种软件设计原则
- HOF(High Order Function)指高阶函数：接收函数作为入参，或者将函数作为出参返回的函数

因为不要重复，所以使用高阶函数

## 为什么

- 可复用
- 代码量少
- 可读性高

## 怎么做

例如：

```js
// 迭代做加法
function arrAdd1(arr) {
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i] + 1)
  }
  return newArr
}

// 迭代做乘法
function arrMult3(arr) {
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i] * 3)
  }
  return newArr
}

// 迭代做除法
function arrDivide2(arr) {
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i] / 2)
  }
  return newArr
}
```

优化为：

```js
// +1 函数
function add1(num) {
  return num + 1
}

// *3函数
function mult3(num) {
  return num * 3
}

// /2函数
function divide2(num) {
  return num / 2
}

function arrCompute(arr, compute) {
  const newArr = []
  for (let i = 0; i < arr.length; i++) {
    // 变化的算式以函数的形式传入
    newArr.push(compute(arr[i]))
  }
  return newArr
}
```
