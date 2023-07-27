# this 与 new

## this

对象方法需要访问对象中存储的信息才能完成其工作

例如，user.sayHi() 中的代码可能需要用到 user 的 name 属性。

为了访问该对象，方法中可以使用 this 关键字

this 的值就是在点之前的这个对象，即调用该方法的对象。

```js
let user = {
  name: 'John',
  age: 30,

  sayHi() {
    // "this" 指的是“当前的对象”
    alert(this.name)
  },
}

user.sayHi() // John
```

### this 不受限制

this 可以用于任何函数，即使它不是对象的方法。

this 的值是在代码运行时计算出来的，它取决于代码上下文。

在没有对象的情况下调用：this == undefined

## new

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)

构造函数在技术上是常规函数。不过有两个约定：

- 它们的命名以大写字母开头
- 它们只能由 "new" 操作符来执行

当一个函数被使用 new 操作符执行时，它按照以下步骤：

- 一个新的空对象被创建并分配给 this
- 函数体执行。通常它会修改 this，为其添加新的属性
- 返回 this 的值

### new 的优先级

new Foo.getName() 顺序是先 Foo.getName()再 new

new Foo().getName() 顺序是先 new Foo()再.getName()

```js
function Foo() {
  getName = function () {
    console.log(1)
  }
  return this
}
Foo.getName = function F() {
  console.log(2)
}
Foo.prototype.getName = function () {
  console.log(3)
}
var getName = function () {
  console.log(4)
}
function getName() {
  console.log(5)
}
Foo.getName() // 2
getName() // 4
Foo().getName() // 1
new Foo.getName() // 2
new Foo().getName() // 3
new new Foo().getName() // 3

// 输出 2 4 1 2 3 3
```

## 参考资料

[现代 javascript](https://zh.javascript.info/object-basics)
[掘金](https://juejin.cn/post/6954263120428662798)
