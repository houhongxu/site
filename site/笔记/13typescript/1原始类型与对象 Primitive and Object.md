# 原始类型与对象 Primitive and Object

## 7 种原始类型

### null 与 undefined

string 类型包含 null 与 undefined

### unique symbol

独一无二的类型，symbol 的子集

## void

空返回值
undefined 能够被赋值给 void 类型的变量

## 数组类型

一般用 string[]形式

### 元组

元组指定数组长度与具体内容，也可以可选
`const arr6: [string, number?, boolean?] = ['linbudu']`

ts4 有具名元组
`const arr7: [name: string, age: number, male: boolean] = ['linbudu', 599, true]`

## 对象类型

### 只读 readonly

### object、Object 以及{}

- Object 是装箱类型，不应该使用
- object 是拆箱类型，引入就是为了解决对 Object 类型的错误使用
- {}是字面量类型，一个空对象，意味着任何非 null / undefined 的值。不应该使用

> 当你不确定某个变量的具体类型，但能确定它不是原始类型，可以使用 object。但我更推荐进一步区分，也就是使用 `Record<string, unknown>` 或 `Record<string, any>` 表示对象，`unknown[]` 或 any[] 表示数组，`(...args: any[]) => any` 表示函数这样。
