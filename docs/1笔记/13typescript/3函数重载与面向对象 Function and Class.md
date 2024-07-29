# 函数重载与面向对象 Function and Class

## 函数

函数类型签名：() => void
不是箭头函数而是类型

interface 进行函数声明：

```ts
interface FuncFooStruct {
  (name: string): number
}
```

### void

推荐仅不返回时使用

### 可选参数与 rest 参数

rest 参数也可以使用元组

### 重载

逻辑较复杂的情况下，函数可能有多组入参类型和返回值类型

如：

```ts
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo)
  } else {
    return foo * 599
  }
}
```

这里的类型签名完全没有体现这一点，我们只知道它的返回值是这么个联合类型

应该使用**函数重载签名**

```ts
function func(foo: number, bar: true): string
function func(foo: number, bar?: false): number
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo)
  } else {
    return foo * 599
  }
}
```

TypeScript 中的重载更像是伪重载，它只有一个具体实现，其重载体现在方法调用的签名上而非具体实现上

### 异步函数、Generator 函数等类型签名

异步为 `Promise<T>`,迭代器不重要

## Class

### 修饰符

- public：此类成员在类、类的实例、子类中都能被访问。
- private：此类成员仅能在类的内部被访问。
- protected：此类成员仅能在类与子类中被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即不允许再访问受保护的成员。
- readonly

在构造函数中对参数应用访问性修饰符，参数会被直接作为类的成员（即实例的属性），免去后续的手动赋值：

```ts
class Foo {
  constructor(public arg1: string, private arg2: boolean) {}
}

new Foo('linbudu', true)
```

### 继承、实现、抽象类

TypeScript 4.3 新增了 override 关键字，来确保派生类尝试覆盖的方法一定在基类中存在定义

一个抽象类描述了一个类中应当有哪些成员（属性、方法等），一个抽象方法描述了这一方法在实际实现中的结构：

```ts
abstract class AbsFoo {
  abstract absProp: string
  abstract get absGetter(): string
  abstract absMethod(name: string): string
}
```

无法声明静态的抽象成员。

interface 不仅可以声明函数结构，也可以声明类的结构：

```ts
interface AbsFoo {
  absProp: string
  get absGetter(): string
  absMethod(input: string): string
}

class Foo implements AbsFoo {
  absProp: string = 'linbudu'

  get absGetter() {
    return 'linbudu'
  }

  absMethod(name: string) {
    return name
  }
}
```

### SOLID 原则

- S，单一功能原则，一个类应该仅具有一种职责
- O，开放封闭原则，一个类应该是可扩展但不可修改的
- L，里式替换原则，一个派生类可以在程序的任何一处对其基类进行替换
- I，接口分离原则，类的实现方应当只需要实现自己需要的那部分接口
- D，依赖倒置原则，对功能的实现应该依赖于抽象层，即不同的逻辑通过实现不同的抽象类
