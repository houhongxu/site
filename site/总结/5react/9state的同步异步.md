# state 的同步异步

## 此同步异步非彼同步异步

虽然我们讨论的是 setState 的同步异步，但这个不是 setTimeout、Promise 那种异步，只是指 setState 之后是否 state 马上变了，是否马上 render

## 什么时候同步什么时候异步

- react 可控时批处理
- react 不可控时，如异步函数 then 中，不批处理

但是 react18 用 createRoot 的 api 后都可以批处理了

## 参考

[掘金](https://juejin.cn/post/7108362046369955847?searchId=2024031614244213E59126A45AAA821A2D)
