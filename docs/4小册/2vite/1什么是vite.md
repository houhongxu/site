# 什么是 vite

自 node 诞生以来，前端渐渐开始有了代码预处理的概念，逐渐诞生了各种构建工具，用来将代码等资源统一，构建为浏览器支持的统一格式

而其中最著名的，当属 webpack，其次则是 rollup

或许大家都听过，web 使用 webpack，库使用 rollup

由此可见，rollup 的构建能力也很强，生态也很强

那么为什么 rollup 不能用于 web 呢

因为 rollup 的定位在于基于 es6 的库开发，很精准，所以并未支持 dev server 的功能

而 web 开发所需要的的脚手架工具，必不可少的功能就是 dev server，包括它的 page reload 和 hmr 功能

所以，我们是不是需要一个基于 es6 的 web 开发构建工具，虽然优势不太明显

另一方面，webpack 的 bundle 概念，使每次 dev server 更新都需要 bundle 一次，速度一直比较缓慢

这时，浏览器原生支持了 esm，可以将 dev sever 的模块解析交给浏览器处理，no bundle 仅编译模块即可，大大加速

那么，我们是不是也需要一个基于 es6 no bundle 的 web 开发工具，优势比较明显了

急，很急，急需大佬

vite 就出现了，基于 rollup 的生态, 提供了 no bundle 的 dev server 和生态完善的 build

别急

还没完，这时还有一种开挂构建工具，使用 go 语言开发的工具 esbuild，没别的，就是快，仅支持到 es6

no bundle+es6，那不正好了，代码转换、代码压缩、代码丑化等，全交给 esbuild

vite 的完全体就诞生了

双引擎架构，极速的 dev server，生态完善的 build
