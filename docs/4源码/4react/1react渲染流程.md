# react 渲染流程

react 有三个部分

- reconciler(协调器 独立包 核心)
- renderer(渲染器 如 react dom 控制浏览器 dom)
- scheduler(调度器 独立包 concurrent mode 核心)

react16 重构 fiber 架构主要是为了中断可持续，也实现了 scheduler 来通过 expirationTimes 模型控制优先级

react17 是 18 的垫脚石版本，主要功能替代 expirationTimes 模型为 lanes 模型实现更细粒度的优先级更新

react18 实现 concurrent mode

## fiber 架构

react 通过 jsx 获取用户书写的 UI

jsx 本质就是语法糖，使用 react.createElement(16)或者 jsx-runtime(17 将由 babel 等 transformer 处理)进行转换为 ReactElement

fiber 会根据 ReactElement 生成 fiber 树，并会使用 diff 算法根据新 ReactElement 与旧 fiber 对比来尽可能复用 fiber

hook 的数据就是保存在 fiber.memoizedState 的链表上的，每个 hook 对应一个链表节点，通过 hook.next 访问下一个 hook，像 useRef、useCallback、useMemo 等比较简单的，就是根据逻辑拿取 hook.memoizedState

### 双缓存架构

fiber 树有两个，树根节点叫 rootFiber，都存在内存中

一个是 current 树，一个是 workInProgress 树，有一个引用叫 fiberRoot 指向 current 树，fiberRoot 指向决定哪个树是 current 而不是命名决定

当需要渲染页面时，current 树对应当前页面，workInProgress 树会进行内存中的构建，并且通过 diff 算法尽量复用，构建完成后 fiberRoot 切换指向 workInProgress 树

workInProgress 树就变成了 current 树

## reconciler

reconciler 通过递归构建完整的 fiber 树，然后交给 renderer 渲染为 dom

递归的过程也被 scheduler 影响，用来控制各种任务的优先级

递归的工作单元是每个 fiber 节点，通过循环进行递归

shouldYield 就是 scheduler 根据优先级控制中断和继续的方法

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

### reconciler render 阶段 递归

## beginWork 递

又分为 mount 首次渲染还是 update 更新

递归中的[递]工作，进行结构处理，标记 Placement 与 ChildDeletion，不进行 Update

### beginWork mount 首次渲染

### beginWork update 更新

## completeWork 归

递归中的[归]工作，处理副作用并生成离屏 DOM

### completeWork mount 首次渲染

### completeWork update 更新

### reconciler commit 阶段

消费副作用进行 DOM 操作并挂载 DOM 树在 div-root

在 commit 最开始的时候，异步处理 useEffect

useEffect 异步执行的原因主要是防止同步执行时阻塞浏览器渲染

#### beforeMutation

执行 DOM 操作前

#### mutation

执行 DOM 操作

#### layout

执行 DOM 操作后

执行 useLayoutEffect 的回调函数

### diff 算法

首先通过 key 判断是否是同一个，key 不同不是

然后通过 type，type 不同不是

最后通过 props 判断

#### 单节点 diff

多个节点变成一个节点

遍历旧 fiber 对比新 element 即可

#### 多节点 diff

多个节点变成多个节点

节点的更新优先级最高，先判断

然后是增删和换位

##### 更新

一一对比
如 A - B - C - D - E - F 和 A - B - D - C - E

对比到第三个位置结束

##### 其他

先将剩余旧 fiber 放到 map 里，这样遍历旧 fiber 复杂度就降为 1，然后遍历新 element 去找旧 fiber，找到所有可复用的

## scheduler

主要功能为：

- 时间切片
- 优先级调度 (react 实现的为 lanes 模型，互相调用时会转换)

### 时间切片

时间切片的本质是模拟实现 requestIdleCallback

```js
宏任务 -
  全部微任务 -
  requestAnimationFrame -
  浏览器重排 / 重绘 / 合成 -
  requestIdleCallback
```

requestAnimationFrame 常用做流畅动画就是因为会在渲染前完成

requestIdleCallback 是在“浏览器重排/重绘”后如果当前帧还有空余时间时被调用

react 一开始是用 requestAnimationFrame+postmessage 实现
后面换成 message channel+postmessage 实现

### 优先级调度

Lane 优先级（31 种，基于二进制方式保存）是 fiber 树构造过程相关的优先级。
事件优先级（4 种）是 Scheduler 优先级和 Lane 优先级相互转换的桥梁。
Scheduler 优先级（5 种）是 scheduler 调度中心相关的优先级。

> 优先级最终会反映到 update.lane 变量

给 run 传入优先级和函数，scheduler 会在合适的时机调用函数

scheduler 有两个队列，预置了 5 种优先级

- timerQueue：保存未就绪任务

- taskQueue：保存已就绪任务

为了能在 O(1)复杂度找到两个队列中时间最早的那个任务，Scheduler 使用小顶堆实现了优先级队列

新任务会进入 timerQueue 并重新排序 timerQueue

当 timerQueue 中有任务就绪，取出 taskQueue 中最早过期的任务并执行

Scheduler 与 React 是两套优先级机制，互相调用时会转换

React 的是 lanes 模型机制

#### lanes 模型（赛道模型）

lanes 将任务优先级的概念与任务批处理分离开来，lanes 的优先级粒度更细

lanes 模型，使用 31 位的二进制表示 31 条赛道，位数越小的赛道优先级越高，某些相邻的赛道拥有相同优先级

优先级越高赛道就一个，优先级越低赛道就越多，因为越低优先级的更新越容易被打断，导致积压下来，所以需要更多的位

## 并发特性和并发更新

就好比你想开空调（开启并发更新），首先你打开屋子的总开关（使用 concurrent 模式），然后你再去打开空调的开关（使用并发特性）

## 并发更新

就是

两个 setState 引起的两个渲染流程，先处理上面那次渲染的 1、2、3 的 fiber 节点，然后处理下面那次渲染的 1、2、3、4、5、6 的 fiber 节点，之后继续处理上面那次渲染的 4、5、6 的 fiber 节点。
