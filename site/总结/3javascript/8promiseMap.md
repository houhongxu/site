# promiseMap

```js
function promiseMap(list, mapper, concurrency) {
  return new Promise((resolve, reject) => {
    let cur = 0
    let resolvedCount = 0
    const len = list.length
    const res = []

    function next() {
      const i = cur++
      // 统一处理list[i]，兼容了promise情况和错误处理
      Promise.resolve(list[i])
        .then((v) => mapper(v, i))
        .then((v) => {
          res[i] = v
          resolvedCount++
          if (resolvedCount === len) {
            resolve(res)
          }
          if (cur < len) {
            next()
          }
        })
    }

    // 初始化开启concurrency个任务，后续由每个任务自己调用next()来开启下一个任务
    for (let j = 0; j < concurrency && j < len; j++) {
      next()
    }
  })
}
```
