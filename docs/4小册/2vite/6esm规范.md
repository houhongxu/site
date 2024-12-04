# esm 规范

在看一个构建工具之前，最基础的是要搞清楚它的模块化处理

毕竟，如果对应模块都产出不了，那架构、应用什么的都无从谈起了

vite 是基于 esm 的，我们首先要了解一下 esm 规范

然后再研究一下 esm 和 cjs 的兼容和转换

先看 node 的支持情况，再看 vite 的支持情况

## esm 规范

esm 规范可不止我们平时常用的导入导出

我简单列一下它的支持功能

- 模块导入导出语法同时支持默认导出和具名导出
- 模块的执行顺序是静态分析且只执行一次
- 支持动态导入在运行时加载
- 浏览器 script 支持.js、.mjs，node 支持.js、.mjs、cjs
- 浏览器 script 支持 type 和 importmap，node 支持 type 和 exports
- es2022 顶级 await
- 模块解析规则支持相对路径和绝对路径，node 中需要扩展名
- 跨模块兼容，node 中 esm 兼容 cjs default 导入
- 支持循环依赖

其中分别有浏览器实现的和 node 实现的

我们这段先看浏览器支持的 esm

这也是 vite 的核心理念 no bundle 的由来

### 浏览器

在之前 script 加载 js，使用的往往是 iife 的格式，因为需要隔离变量

所以，模块解析都需要在 node 端处理好

但是在支持 esm 后，script 可以通过 type module 直接引入 esm 格式的 js

相当于接手了模块解析的活，解放了 node 的一部分任务

那么，通过这样，dev server 只需要按浏览器解析后的需求，请求指定的模块即可

这就是 no bundle

## esm import cjs

### node

esm 是兼容 cjs 的

原生仅限于 default 导入完全兼容，因为 cjs 没有 default 概念，所以导入的是完整的 module.exports 对象

```js
import allExport from "./utils/default-named-add-cjs.cjs";
const defaultCjs = allExport.default;
const addCjs = allExport.addCjs;
```

named 导入只兼容一个变量

```js
import { addCjs } from "./utils/named-add-cjs.cjs";
```

而混合导入完全不兼容，需要其他工具支持才能实现如 ts，需要 ts 的 esModuleInterop 属性 true

```js
import React, { useState } from "react";
```

### vite

vite 是官方支持了 ts 的，通过源码搜索可以直接发现是没有 @rollup/plugin-typescript

而 esbuild 是官方支持 ts 的，所以很明显 vite 是通过 esbuild 作为转换器转换 ts 的

ts 支持了那么 vite 也支持了

## cjs require esm

### node

cjs 是运行时导入的，所以通过 await import 运行时导入 esm 是兼容的

```js
const allExport = await import("./add-esm.mjs");
const defaultEsm = allExport.default;
const addEsm = allExport.addEsm;
```

### vite

node 兼容的 vite 自然支持

## cjs > esm

cjs > esm 是 vite 里最常用的转换了

预构建和 build 都很多

理论上 vite 打包基于 rollup

那么 build 时是不是和 rollup 的 cjs > esm 一样呢

其实不是，transform 阶段 vite 是交给了 esbuild

我们可以对比一下 vite、rollup、esbuild 的产物

vite

```js
// 获取对象所有属性包括不可枚举
var __getOwnPropNames = Object.getOwnPropertyNames;

// 模拟的cjs加载函数，cb是相当于node的iife模块定义函数
// mod是module的缓存，没传入相当于没有缓存

// 逗号表达式先计算左边然后执行并返回右边，严格模式下(0, func)能保证func当做函数调用，

// 所以执行顺序就是 0 > cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }) > 返回mod.exports
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };

// 调用模拟cjs，对象的key为文件名，对象的value为node的iife函数
var require_add_cjs = __commonJS({
  "add-cjs.js"(exports, module) {
    module.exports = {
      addCjs(a, b) {
        return a + b;
      },
      addDefault: { text: "我cjs没有default" },
    };
  },
});

export default require_add_cjs();
```

rollup

```js
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
    ? x["default"]
    : x;
}

var addCjs$1;
var hasRequiredAddCjs;

function requireAddCjs() {
  if (hasRequiredAddCjs) return addCjs$1;
  hasRequiredAddCjs = 1;
  addCjs$1 = {
    addCjs(a, b) {
      return a + b;
    },
    addDefault: { text: "我cjs没有default" },
  };
  return addCjs$1;
}

var addCjsExports = requireAddCjs();
var addCjs = /*@__PURE__*/ getDefaultExportFromCjs(addCjsExports);

export { addCjs as default };
```

esbuild

```js
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
var require_add_cjs = __commonJS({
  "3-cjs-to-esm/add-cjs.js"(exports, module) {
    module.exports = {
      addCjs(a, b) {
        return a + b;
      },
      addDefault: { text: "\u6211cjs\u6CA1\u6709default" },
    };
  },
});
export default require_add_cjs();
```

rollup 的格式和 vite 并不相同

## esm > cjs

esm > cjs 是少见的需求，哪怕 webpack 处理代码转为 webpackRequire 也不完全属于这种

vite 可能不太考虑这种场景，所以只有 srr 打开时可以转化

那么是不是和 cjs > esm 一样基于 esbuild 呢

不是，这个反而是基于 rollup 转换，可以看产物对比

vite

```js
"use strict";
// 添加esm转换标记
Object.defineProperties(exports, {
  __esModule: { value: true },
  [Symbol.toStringTag]: { value: "Module" },
});

function addEsm(a, b) {
  return a + b;
}

const addEsm$1 = {
  text: "我是esm default",
};

exports.addEsm = addEsm;
exports.default = addEsm$1;
```

rollup

```js
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

function addEsm(a, b) {
  return a + b;
}

var addEsm$1 = {
  text: "我esm有default",
};

exports.addEsm = addEsm;
exports.default = addEsm$1;
```

esbuild

```js
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var add_esm_exports = {};
__export(add_esm_exports, {
  addEsm: () => addEsm,
  default: () => add_esm_default,
});
module.exports = __toCommonJS(add_esm_exports);
function addEsm(a, b) {
  return a + b;
}
var add_esm_default = {
  text: "\u6211esm\u6709default",
};
```

应该是通过 rollup-commonjs 插件兼容比较好
