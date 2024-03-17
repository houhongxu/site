# vite 和 webpack HMR

都是 ws 协议

webpack 将模块分成 chunk
vite 原本就是模块单独加载
都是模块级别细粒度

nobundle 会快，因为热更新时 webpack 也需要将模块打包为 chunk 而 vite 不需要打包业务代码，最多需要 transform 一下 tsx 成为 js，还是用 esbuild tansform 的，肯定也是更快的
