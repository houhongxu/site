# 所有页面都是 webview 显示的吗

由于我们项目的 tabbar 以外的页面，每次进入都会加载，而 tabbar 界面不会，所以有了疑问：所有页面都是 webview 显示的吗？

## 小程序的页面是否原生

经过查阅，查到安卓机的识别原生元素的截图

tabbar 和 navbar 是原生的，页面内容都是 webview

所以这就是为什么 tabbar 和 navbar 有着各种限制

那这个缓存问题就不是原生页面的问题

## 那为什么首页等 tabbar 页面会缓存

根据[微信文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)

小程序框架以栈的形式维护了当前的所有页面

所以在某一 tab 开始进入页面后，加载每一级页面，返回时销毁每一级

所以 tab 以外的页面第二次进入都会重新加载

而 tabbar 页面点击切换不会

## tabbar 点击切换的逻辑是什么

根据[官方社区](https://developers.weixin.qq.com/community/develop/doc/000e00a8b4c7d855b5c628f7d5c000?_at=6T7zU)

以及[官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html)

点击切换 tab 就是使用的 wx.switchTab 的逻辑

跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面

所以 tab 页面是不会关闭的，所以就不会重新加载
