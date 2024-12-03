# 为什么选 vite

构建工具有着处理模块化、dev server、兼容性、build 等需求

还有额外的模块联邦、微前端等需求

为什么选 vite

要先根据需要来看 vite 是否可以满足基础需求，是否更为优秀

我们来根据每一个需求点单独进行研究

## 模块化

首先是模块化

vite 基于 模块规范 esm，狠狠战未来

vite 就是基于浏览器已经实现了 esm 支持来设计

可以让浏览器接管一部分打包工作

实现 no bundle 的设计

具体的模块化支持情况我们将在下一篇来一一验证

## dev server

todo

仅更新浏览器发起请求的模块

需要使用预构建转换 cjs 和请求瀑布流

但是由于 esbuild 的转换速度和开发服务本地请求，依然比较快

问题：二次预构建 请求瀑布流

## 兼容性

todo

支持使用 esbuild swc babel postcss 等

默认兼容到 es6 Chrome >=87

兼容性可自定义

## build

todo

生产环境使用 ESM 时，大量的请求即使使用 HTTP2 也会加载缓慢，所以仍然需要打包

使用 rollup 生态，具有完整的打包功能

问题：微前端 模块联邦 开发生产不一致

## 微前端

todo

qiankun 为例，互相都没有官方支持

有社区插件可以支持 qiankun

慎用

## 模块联邦

todo

module federation v2 官方支持 vite 插件
