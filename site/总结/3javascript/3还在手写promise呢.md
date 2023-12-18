# promise

```js
const STATES = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
}

class myPromise {
  // 初始化state为等待态
  state = STATES.pending
  // 成功的值
  value = undefined
  // 失败的原因
  reason = undefined
  // 订阅resolve事件
  onFulfilledCallbacks = []
  // 订阅reject事件
  onRejectedCallbacks = []

  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new Error('参数executor不是函数')
    }

    // 成功
    const resolve = (value) => {
      if (this.state === STATES.pending) {
        this.value = value
        this.state = STATES.fulfilled
        // 订阅resolve事件
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }

    // 失败
    const reject = (reason) => {
      if (this.state === STATES.pending) {
        this.reason = reason
        this.state = STATES.rejected
        // 订阅reject事件
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    try {
      // 立即执行回调executor
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  // then
  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = (value) => value
    }
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => {
        throw new Error(reason)
      }
    }

    // 实现链式调用
    const promise2 = new myPromise((resolve, reject) => {
      // 成功的任务立即执行onFulfilled回调并返回
      if (this.state === STATES.fulfilled) {
        const res = onFulfilled(this.value)

        return resolve(res)
      }

      // 失败的任务立即执行onRejected回调并返回
      if (this.state === STATES.rejected) {
        const res = onRejected(this.reason)

        return reject(res)
      }

      // 还没有结果的异步任务
      if (this.state === 'pending') {
        // 发布onFulfilled回调执行事件
        this.onFulfilledCallbacks.push(() => {
          const res = onFulfilled(this.value)

          resolve(res)
        })

        // 发布onRejected回调执行事件
        this.onRejectedCallbacks.push(() => {
          const res = onRejected(this.reason)

          reject(res)
        })
      }
    })

    return promise2
  }
}
```

## all
