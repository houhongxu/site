# umd 的退幕

在 2025 年，react19 包取消了 umd 产物，仅有 cjs 这个产物了

但是，umd 老当益壮，还是很常用的，像组件库常用产物就是 umd/cjs/es

我最近写的包[remote-module](https://www.npmjs.com/package/remote-module)也用到了 umd，还是需要重温一遍

## umd 的结构

这里结合包的 remote-module 逻辑来分析 umd

这是一个加载和产出远程模块的包，可以脱离 webpack5 实现类似模块联邦的功能，简单地共享模块

可以参考其构建的 umd 文件结构，也就是 webpack 的 umd 产物结构

```js
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["remote-module"] = factory();
  else root["remote-module"] = factory();
})(window, () => {});
```

可以看到 webpackUniversalModuleDefinition 就是 umd 的包裹函数了

将 window 传给 root，webpack 传统产物函数传给 factory，即可执行 umd 的兼容模块逻辑

umd 逻辑就是很简单的 if else 语句，共四种情况，依次判断

- 第一种情况，是判断 exports 对象存在且 module 对象存在，代表是 cjs，则使用 module.export 导出
- 第二种情况，是判断 define 函数和 define.amd 是否存在，代表是 amd，amd 很少用了
- 第三种情况，也是判断 exports，但是没有判断 module，是另一种 cjs 导出，使用 exports["remote-module"] 具名导出
- 第四种情况，则直接挂在 root["remote-module"]，也就是挂 window 上

其实很多情况下都是第四种情况，因为 cjs 往往是直接在 node 导入使用的

所以 umd 其实大多替代了 iife 立即执行函数的工作

那么 umd 可能还会继续发光发热很久

## 从 umd 中取值

最近用到的场景就是，远程加载 umd 文件后，获取到了 umd 字符串

但是我需要其中导出的组件拿来使用，就需要从 umd 中取出组件

这里是使用的 umd 第一种情况，

模拟了完整的 cjs 参数，通过 Function 执行 umd 字符串，来拿到模块

然后通过代码的 esm 导出到项目里使用

```ts
const res = await fetch(remoteUrl);

const text = await res.text();

// 模拟cjs module
const module = {
  exports: { default: {} as ComponentType<any> },
};

// 模拟cjs require
const require = (pkgName: string) => {
  return window[pkgName as keyof Window];
};

// 执行umd文件，并使用模拟的module.exports拿到webpackModule
Function("require, exports, module", text)(require, module.exports, module);

console.log("remote-component module:", module);

return { default: module.exports.default };
```
