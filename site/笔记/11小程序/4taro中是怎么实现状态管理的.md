# taro 中是怎么实现状态管理的

因为小程序是 mpa，跨页面是无法进行状态管理的，同时 window 也不是单例的

通过查询资料，发现 zustand 有本地化中间件(localstorage 等)，redux 等有 weapp 版本

所以多页面状态可以使用两种方式实现

- 本地化
- 使用微信提供的全局 globalData

而 taro 维护了全局状态，根据推测应该是维护在 globalData 中，而且每个页面的页面栈中也有所有状态

所以 taro 可以直接使用状态管理

另外 taro 还提供事件中心 和 自行命名的 JS 文件控制 globalData 的方式

taro 传参一般有六种方式

- url 参数
- 本地化
- 状态管理工具
- taro 事件中心
- taro 页面栈
- 自行命名的 JS 文件控制 globalData
