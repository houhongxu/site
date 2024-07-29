# React 中函数式实践

UI=f(state)

React 的视图会随着状态的变化而变化

细分就是：

真实 dom=虚拟 dom=函数组件(props,context,state)

## react 函数式组件渲染流程

```js
const App = () => {
  const [num, setNum] = useState(1)

  return React.createElement('span', null, num)
}

const rootDom = document.getElementById('root')

ReactDOM.render(<App />, rootDom)
```

两个流程：

- 通过 state 计算虚拟 dom
- 虚拟 dom 渲染真实 dom

## 为什么是函数式组件

上述流程可以对应为：

- 函数组件：计算层
- render，hook 等框架功能：副作用层

所以函数组件处理计算即为纯函数，框架尤其是 hook 来处理副作用

## 怎么做到的函数式

### JSX

JSX 的本质是`React.createElement`的语法糖，仅仅为了计算虚拟 dom

### hook

hook 维护的状态本质上和 props、context 等一样也是外部数据

hook 提供的功能也是框架提供的功能，不影响计算
