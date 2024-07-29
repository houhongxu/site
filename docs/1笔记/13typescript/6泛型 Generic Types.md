# 泛型 Generic Types

TypeScript 是一门对类型进行编程的语言，那么泛型就是这门语言里的（函数）参数

## 类型别名中的泛型

### 内置类型工具

```ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

### 条件类型

```ts
type IsEqual<T> = T extends true ? 1 : 2

type A = IsEqual<true> // 1
type B = IsEqual<false> // 2
type C = IsEqual<'linbudu'> // 2
```

## 泛型约束与默认值

```ts
type ResStatus<ResCode extends number = 10000> = ResCode extends
  | 10000
  | 10001
  | 10002
  ? 'success'
  : 'failure'

type Res4 = ResStatus // "success"
```

泛型 T 默认约束值在 TS 3.9 版本以前是 any，而在 3.9 版本以后则为 unknown

## 多泛型关联

```ts
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult

//  "passed!"
type Result1 = Conditional<'linbudu', string, 'passed!', 'rejected!'>

// "rejected!"
type Result2 = Conditional<'linbudu', boolean, 'passed!', 'rejected!'>
```

## 对象类型中的泛型

```ts
interface IRes<TData = unknown> {
  code: number
  error?: string
  data: TData
}
```

可以用 I 代表 interface，T 代表泛型，后面跟具体名称

## 函数中的泛型

函数的泛型更明显地体现了泛型在调用时被填充这一特性

不要为了用泛型而用泛型，泛型参数 T 没有被返回值消费，也没有被内部的逻辑消费，没有意义

## Class 中的泛型

## 内置方法中的泛型

### Promise

```ts
interface PromiseConstructor {
  resolve<T>(value: T | PromiseLike<T>): Promise<T>
}

declare var Promise: PromiseConstructor
```

### Array

```ts
const arr: Array<number> = [1, 2, 3]

// 类型“string”的参数不能赋给类型“number”的参数。
arr.push('linbudu')
// 类型“string”的参数不能赋给类型“number”的参数。
arr.includes('linbudu')

// number | undefined
arr.find(() => false)

// 第一种 reduce
arr.reduce((prev, curr, idx, arr) => {
  return prev
}, 1)

// 第二种 reduce
// 报错：不能将 number 类型的值赋值给 never 类型
arr.reduce((prev, curr, idx, arr) => {
  return [...prev, curr]
}, [])
```
