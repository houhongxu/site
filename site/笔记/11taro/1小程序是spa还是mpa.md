# 小程序是 spa 还是 mpa

taro 的打包产物中，每一个页面都是由三个文件组成：

- index.js
- index.json
- index.wxml

所以感觉奇怪，小程序是 spa 还是 mpa？

## 首先去根据文档来了解小程序

由[微信文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/framework.html#%E6%B8%B2%E6%9F%93%E5%B1%82%E5%92%8C%E9%80%BB%E8%BE%91%E5%B1%82)得知：

1. 小程序运行在微信客户端 Native 中

2. WXML 和 WXSS 工作在渲染层，JS 脚本工作在逻辑层，两个层分别由两个线程运行

3. **小程序存在多个界面**，所以渲染层存在多个 WebView 线程，这两个线程的通信会经由 Native 中转

> 更详细的说明关于为什么选择双线程，则见[教程文档](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0006a2289c8bb0bb0086ee8c056c0a)与[博文的笔记](https://github.com/berwin/Blog/issues/43)

由上面的 3 就能得知小程序是 mpa 了

## 小程序架构

微信小程序主要分为 逻辑层 和 视图层，以及在他们之下的原生部分。逻辑层主要负责 JS 运行，视图层主要负责页面的渲染，它们之间主要通过 Event 和 Data 进行通信，同时通过 JSBridge 调用原生的 API。这也是以微信小程序为首的大多数小程序的架构
