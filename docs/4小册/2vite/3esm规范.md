# esm 规范

## 纯 esm 规范

- 模块导入导出语法同时支持默认导出和具名导出
- 模块的执行顺序是静态分析且只执行一次
- 支持动态导入在运行时加载
- 浏览器 script 支持.js、.mjs，node 支持.js、.mjs、cjs，并支持 type module 默认 esm
- es2022 顶级 await
- 模块解析规则支持相对路径和绝对路径，node 中需要扩展名
- 跨模块兼容，node 中 esm 兼容 cjs default 导入
- 支持循环依赖

## esm import cjs

## cjs require esm

## esm > cjs

## cjs > esm
