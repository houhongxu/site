# 彻底搞清楚 esm 与 cjs 与 umd

## 简介

cjs 是 node 原生支持的规范，由 node 实现 loader，无法直接用于浏览器，而且同步加载不适用于浏览器

所以有了 amd 规范，异步加载，但是 loader 未被浏览器官方实现，所以需要用 loader 库，比如 requirejs

umd 是 cjs 与 amd 的兼容，不作为规范，虽然已经过时，但是现在仍然用于 react 发包

esm 规范由 ecma 官方支持，所以浏览器与 node 都进行了 loader 支持，而且 node 中的 cjs 模块依旧可以直接使用 esm 导入 esm 模块

## chalk5 只支持 esm

chalk5 不支持 cjs
[见文档](https://github.com/chalk/chalk)

> IMPORTANT: Chalk 5 is ESM. If you want to use Chalk with TypeScript or a build tool, you will probably want to use Chalk 4 for now. Read more.

## 浏览器等不支持 导入 mjs 文件

mdx 也不支持导入 使用 mjs 文件 的库
但是支持 antd 源码使用的的 导入方式，
因为里面 esm 导入方式的文件也是 js 文件
所以研究了一下， tsup 可以 打包为支持 esm 的库，但是不使用 mjs
[见文档](https://tsup.egoist.dev/#output-extension)

## esm 与 cjs 互相引入

esm 是异步
cjs 是同步

esm 可以直接引入 cjs
cjs 引入 esm 需要处理，require 改成 await import ，且需要异步环境

> tsc 会处理 await import 为 require，则需要封装函数 c`onst dynamicImport = new Function('m', 'return import(m)');` 包装一下 await import

## ts

ts 配置 "esModuleInterop": true // 在 ESM 语法中导入 CJS 模块时通常需要加上这个配置
可以 ESM 语法中直接导入 CJS 模块

## rollup

rollup 是原生只支持 esm 的，使用 cjs 需要插件，但是很常用

## 导入库的时候是怎么区分 cjs 与 esm 文件的

库会配置 package.json 字段

```json
{
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js"
}
```

还可以用 exports 字段
优先级比 main 和 module 高，也就是说，匹配上 exports 的路径就不会使用 main 和 module 的路径。

```json
{
  "exports": {
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js"
  }
}
```

### rollup 支持的打包格式

- amd – 异步模块定义，用于像 RequireJS 这样的模块加载器
- cjs – CommonJS，适用于 Node 和 Browserify/Webpack
- esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 `<script type=module>` 标签引入
- iife – 一个自动执行的功能，适合作为`<script>`标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
- umd – 通用模块定义，以 amd，cjs 和 iife 为一体
- system - SystemJS 加载器格式

## antd

es/index.js 下就是 es6 的打包方式
dist/antd.js 下就是 umd 的打包方式
lib/index.js 下就是 cjs 的打包方式
