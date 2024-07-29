# 结构化类型系统 Structural Type System

## 结构化类型系统

TypeScript 比较两个类型并非通过类型的名称，而是比较这两个类型上实际拥有的属性与方法

```ts
class Cat {
  eat() {}
}

class Dog {
  eat() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog()) // 正常
```

结构类型的别称鸭子类型（Duck Typing），这个名字来源于鸭子测试（Duck Test）。其核心理念是，如果你看到一只鸟走起来像鸭子，游泳像鸭子，叫得也像鸭子，那么这只鸟就是鸭子

```ts
class Cat {
  meow() {}
  eat() {}
}

class Dog {
  eat() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog()) // 报错！

// ---

class Cat {
  eat() {}
}

class Dog {
  bark() {}
  eat() {}
}

function feedCat(cat: Cat) {}

feedCat(new Dog())
```

结构化类型系统认为 Dog 类型完全实现了 Cat 类型。至于额外的方法 bark，可以认为是 Dog 类型继承 Cat 类型后添加的新方法，即此时 Dog 类可以被认为是 Cat 类的子类

面向对象编程中的里氏替换原则也提到了鸭子测试：如果它看起来像鸭子，叫起来也像鸭子，但是却需要电池才能工作，那么你的抽象很可能出错了

## 标称类型系统

标称类型系统（Nominal Typing System）要求，两个可兼容的类型，其名称必须是完全一致的
