# taro 中小程序的生命周期和 react 的 hook 是怎么统一的

小程序的生命周期是小程序暴露的 api

taro 对其进行封装，如 onShow 变成 react 的 hook useDidShow

使用 react 语法进行使用，react 本身的 useEffect 等则仅对 react 生效

可以理解层级为，taro 将 react 语法编译成小程序语法，其中包括 taro 提供的 react api 如 useDidShow
