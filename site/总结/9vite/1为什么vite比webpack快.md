# 为什么 vite 比 webpack 快

## 开发环境

### 编译方式

- webpack 会打包成 bundle(dist)然后再开启 dev 服务
- vite 先开启 dev 服务，在接受到 http 请求时，再对访问的模块进行编译(no bundle)

### 编译工具

- webpack 使用 babel 等工具
- vite 使用 esbuild 加快构建

### 热更新

- webpack 改变文件时编译新文件
- vite 改变文件时只编译新模块

## 生产环境

## 兼容性

- webpack 使用 babel 具有极佳兼容性
- vite 使用 esbuild 最低兼容 es6，使用 legacy 插件(使用 babel)才可以兼容更低版本

> vite 开发时尽管模拟了 rollup 插件流程，但是因为 nobunlde 与 bundle 的区别，开发环境与生产环境仍然可能出现不同
