# 内部类型工具 Internal Type Tools

使用方式：

- 操作符：如 keyof，typeof
- 关键字：如 type，in，is
- 专用语法：如 索引签名类型

使用目的：

- 类型创建
- 类型安全保护

## 类型创建

### 类型别名

type 是对一组类型或一个特定类型的封装，仅仅是起别名
interface 是类型接口，声明一个新类型

类型别名还能作为工具类型，工具类同样基于类型别名，只是多了个泛型

```ts
type Factory<T> = T | number | string
```

工具类型就像一个函数一样，泛型是入参，内部逻辑基于入参进行某些操作，再返回一个新的类型
当然，我们一般不会直接使用工具类型来做类型标注，而是再度声明一个新的类型别名

```ts
type FactoryWithBool = Factory<boolean>

const foo: FactoryWithBool = true
```

### 联合类型与交叉类型

|| 与 &&
对象类型的交叉类型，合并属性
联合类型组成的交叉类型，取交集

```ts
type UnionIntersection1 = (1 | 2 | 3) & (1 | 2) // 1 | 2
type UnionIntersection2 = (string | number | symbol) & string // string
```

### 索引类型

- 索引签名类型：`[key: string]: string`在接口或类型别名中，快速声明一个键值类型一致的类型结构
- 索引类型查询：`keyof`将对象中的所有键转换为对应字面量类型，然后再组合成联合类型，注意并不会将数字类型的键名转换为字符串类型字面量，而是仍然保持为数字类型字面量
- 索引类型访问：通过键的字面量类型（'propA'）访问这个键对应的键值类型（number）

keyof 操作符(索引类型查询)能一次性获取这个对象所有的键的字面量类型，也能用在索引类型访问：

```ts
interface Foo {
  propA: number
  propB: boolean
  propC: string
}

type PropTypeUnion = Foo[keyof Foo] // string | number | boolean
```

### 映射类型

`in`基于键名映射到键值类型

```ts
type Clone<T> = {
  [K in keyof T]: T[K]
}
```

`K in` 属于映射类型的语法，`keyof T` 属于 `keyof` 操作符(索引类型查询)，[`K in keyof T]`的`[]`属于索引签名类型，`T[K]`属于索引类型访问

## 类型安全保护

## 类型查询操作符 typeof

绝大部分情况下，typeof 返回的类型就是当你把鼠标悬浮在变量名上时出现的推导后的类型，并且是最窄的推导程度（即到字面量类型的级别）

## 类型守卫

类型的控制流分析会随着你的代码逻辑不断尝试收窄类型（也可以简单理解为类型推导）

但是类型控制流分析做不到跨函数上下文来进行类型的信息收集

TypeScript 引入了 is 关键字来显式地提供类型信息

```ts
export type Falsy = false | '' | 0 | null | undefined

export const isFalsy = (val: unknown): val is Falsy => !val

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined

export const isPrimitive = (val: unknown): val is Primitive =>
  ['string', 'number', 'boolean', 'undefined'].includes(typeof val)
```

这样其他函数使用工具函数时会得到正确的类型推导

## 基于 in 与 instanceof 的类型保护

in 操作符 并不是 TypeScript 中新增的概念，而是 JavaScript 中已有的部分，它可以通过 key in object 的方式来判断 key 是否存在于 object 或其原型链上（返回 true 说明存在）

```ts
interface Foo {
  foo: string
  fooOnly: boolean
  shared: number
}

interface Bar {
  bar: string
  barOnly: boolean
  shared: number
}

function handle(input: Foo | Bar) {
  if ('foo' in input) {
    input.fooOnly
  } else {
    input.barOnly
  }
}
```

instanceof 同理，只不过是判断原型

## 类型断言守卫

类似于 node 中的 assert 模块，断言后的代码中就一定是符合断言的类型，尽管执行会抛出错误

```ts
import assert from 'assert'

let name: any = 'linbudu'

assert(typeof name === 'number')

// number 类型
name.toFixed()
```

但是如果没有在 node 环境，就需要通过 ts 的 asserts 关键字来断言

```ts
let name: any = 'linbudu'

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number!')
  }
}

assertIsNumber(name)

// number 类型！
name.toFixed()
```

写在返回值的位置应该是意味着是对后续代码的断言
