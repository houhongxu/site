# 描述 UI

## 步骤

- React 组件
- 导入与导出组件
- 使用 JSX 编写标签
- 在 JSX 中使用大括号编写 JavaScript
- 将 props 传递给一个组件
- 条件渲染
- 渲染列表
- 保持组件的纯粹\*
- 将 UI 视为树

## 保持组件的纯粹

### 纯函数

满足：

- 只负责自己的任务
- 输入相同，输出也相同

React 假设所有组件都是纯函数

> 在 React 中，你可以在渲染时读取三种输入：props，state 和 context。你应该始终将这些输入视为只读

### 副作用

（不符合）预期的后果

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>
}

let cups = []

export default function TeaGathering() {
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />)
  }
  return cups
}
```

多次调用组件会产生不同的 JSX 等

> 事件处理程序无需是纯函数，找不到合适事件时再使用 useEffect

### 局部 突变(mutation)

变化完全藏在组件里，便不是副作用

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>
}

export default function TeaGathering() {
  let cups = []
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />)
  }
  return cups
}
```
