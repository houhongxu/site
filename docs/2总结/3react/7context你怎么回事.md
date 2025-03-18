# context 你怎么回事

## context

Context：传递 props 的另一种方法

Context 让父组件可以为它下面的整个组件树提供数据

value 变化时会让所有消费该 Context 的组件变化

Context 会通过 Object.is()对比 value

## 为什么消耗更大

value 是对象时，因为不可变数据，更新对象属性需要拷贝一个新对象

但是因为 Context 发生变化时就会触达所有的消费者

所以所有消费者，尽管一个 100 属性的对象只更新了一个属性，都会更新

> React.memo 只只会针对 props 做优化，如果组件中 useContext 依赖的 context value 发生变化，组件依旧会进行重渲染

## 解决

## use-context-selector 库

用 useRef 存原始 value，不使用原始 value 触发渲染

通过发布订阅按需渲染

## 把 Context 拆分的粒度足够小

但是这样又会带来其他问题：ContextProvider 会嵌套多层

同时对于粒度的把握对开发者来说又会带来一定的业务心智负担

## 建议

不频繁更改的全局状态（比如说：自定义主题、账户信息、权限信息等）可以合理使用 Context，而对于其他频繁修改的全局状态可以通过其他数据流方式维护
