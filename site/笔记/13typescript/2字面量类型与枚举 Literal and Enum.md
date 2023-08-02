# 字面量类型与枚举 Literal and Enum

## 字面量类型

原始类型子集
一般作为联合类型使用

### 类型控制流分析初探

某些情况下将变量类型推导为字面量类型
i 是 string
`let i = 'xxx'`
i 是 xxx 字面量
`const i = 'xxx'`

## 联合类型

- 对于联合类型中的函数类型，需要使用括号()包裹起来
- 函数类型并不存在字面量类型，因此这里的 (() => {}) 就是一个合法的函数类型
- 你可以在联合类型中进一步嵌套联合类型，但这些嵌套的联合类型最终都会被展平到第一级中

可以实现**互斥属性**

```ts
interface Tmp {
  user:
    | {
        vip: true
        expires: string
      }
    | {
        vip: false
        promotion: string
      }
}

declare var tmp: Tmp

if (tmp.user.vip) {
  console.log(tmp.user.expires)
}
```

## 枚举类型

对象类型的扩展

### 延迟求值

那么没有使用延迟求值的枚举成员必须放在使用常量枚举值声明的成员之后

```ts
const returnNum = () => 100 + 499

enum Items {
  Foo = returnNum(),
  Bar = 599,
  Baz,
}
```

### 对象与枚举区别

对象是单向映射的，我们只能从键映射到键值。而枚举是双向映射的，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员

> 仅有值为数字的枚举成员才能够进行这样的双向枚举，字符串枚举成员仍然只会进行单次映射

```ts
enum Items {
  Foo,
  Bar,
  Baz,
}

const fooValue = Items.Foo // 0
const fooKey = Items[0] // "Foo"
```

因为数字枚举的编译结果进行了两次赋值

```ts
'use strict'
var Items
;(function (Items) {
  Items[(Items['Foo'] = 0)] = 'Foo'
  Items[(Items['Bar'] = 1)] = 'Bar'
  Items[(Items['Baz'] = 2)] = 'Baz'
})(Items || (Items = {}))
```

Items 值为`{0: 'Foo', 1: 'Bar', 2: 'Baz', Foo: 0, Bar: 1, Baz: 2}`

### 常量枚举

只能通过枚举成员访问枚举值，而不能通过值访问成员

```ts
const enum Items {
  Foo,
  Bar,
  Baz,
}

const fooValue = Items.Foo // 0
const fooKey = Items[0] // 无法访问
```
