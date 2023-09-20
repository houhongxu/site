# 包含 min 函数的栈 TODO

[🔗 LeetCode](https://leetcode.cn/problems/bao-han-minhan-shu-de-zhan-lcof/)

定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。

**示例** 1：

```js
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.min();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.min();   --> 返回 -2.
```

**提示**：

- 各函数的调用总次数不超过 20000 次

## 解题思路

题目信息：调用 min、push 及 pop 时间复杂度都是 O(1)

### 思路一

刚开始想每次记录 min 值，后续发现一旦 pop 则出问题

然后思考应该用栈记录每次 push 后的 min 值，但是 pop 后不知道是否需要将 min 值弹出，需要遍历查找

最后发现有个记录 min 值的 index，这样 pop 时可以根据 index 直接判断是否需要弹出 min 值

### 首次代码

```ts
class MinStack {
  arr: number[] = []
  minStackIndex: number[] = []

  push(x: number): void {
    this.arr.push(x)

    const curMin = this.arr[this.minStackIndex[this.minStackIndex.length - 1]]

    if (this.minStackIndex.length) {
      if (curMin > x) {
        this.minStackIndex.push(this.arr.length - 1)
      }
    } else {
      this.minStackIndex.push(0)
    }
  }

  pop(): void {
    this.arr.pop()

    const curMinIndex = this.minStackIndex[this.minStackIndex.length - 1]

    if (this.arr.length && this.arr.length === curMinIndex) {
      this.minStackIndex.pop()
    }
  }

  top(): number {
    return this.arr[this.arr.length - 1]
  }

  min(): number {
    const curMin = this.arr[this.minStackIndex[this.minStackIndex.length - 1]]

    return curMin
  }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.min()
 */
```
