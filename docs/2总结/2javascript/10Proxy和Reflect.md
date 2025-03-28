# Proxy 和 Reflect

## Proxy

顾名思义，是为了代理对象

```js
const obj = new Proxy(
  {},
  {
    get: function (target, propKey, receiver) {
      console.log(`getting ${propKey}!`);

      return Reflect.get(target, propKey, receiver);
    },

    set: function (target, propKey, value, receiver) {
      console.log(`setting ${propKey}!`);

      return Reflect.set(target, propKey, value, receiver);
    },
  }
);
```

get set 方法是最基本的

一共有 13 个支持的方法

- get(target, propKey, receiver)
- set(target, propKey, value, receiver)
- has(target, propKey)
- deleteProperty(target, propKey)
- ownKeys(target)
- getOwnPropertyDescriptor(target, propKey)
- defineProperty(target, propKey, propDesc)
- preventExtensions(target)
- getPrototypeOf(target)
- isExtensible(target)
- setPrototypeOf(target, proto)
- apply(target, object, args)
- construct(target, args)

另外还可以使用`Proxy.revocable()`方法来取消 Proxy

```js
let target = {};
let handler = {};

let { proxy, revoke } = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo; // 123

revoke();
proxy.foo; // TypeError: Revoked
```

## Reflect

是为了将 Object 上面的一些不合适的和属于语言内部的方法（比如 Object.defineProperty）放在 Reflect 上

Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法

Reflect 对象一共有 13 个静态方法。

Reflect.apply(target, thisArg, args)
Reflect.construct(target, args)
Reflect.get(target, name, receiver)
Reflect.set(target, name, value, receiver)
Reflect.defineProperty(target, name, desc)
Reflect.deleteProperty(target, name)
Reflect.has(target, name)
Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)
