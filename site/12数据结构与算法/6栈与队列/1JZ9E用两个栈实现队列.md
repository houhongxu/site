# 用两个栈实现队列

[🔗 LeetCode](https://leetcode.cn/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )

**示例** 1：

```js
输入：
["CQueue","appendTail","deleteHead","deleteHead","deleteHead"]
[[],[3],[],[],[]]
输出：[null,null,3,-1,-1]
```

**示例** 2：

```js
输入：
["CQueue","deleteHead","appendTail","appendTail","deleteHead","deleteHead"]
[[],[],[5],[2],[],[]]
输出：[null,-1,null,null,5,2]
```

**提示**：

- 1 <= values <= 10000
- 最多会对 appendTail、deleteHead 进行 10000 次调用

## 解题思路

题目信息：两个栈

### 思路一

分为入口栈和出口栈，入队时进入入口栈，出队时判断出口栈有没有数据，如果没有数据则将入口栈内容压入出口栈，然后出口栈出栈，没有内容返回-1

### 首次代码

```ts
class CQueue {
  in: number[]
  out: number[]

  constructor() {
    this.in = []
    this.out = []
  }

  appendTail(value: number): void {
    this.in.push(value)
  }

  deleteHead(): number {
    if (!this.out.length) {
      while (this.in.length) {
        this.out.push(this.in.pop())
      }
    }

    return this.out.pop() ?? -1
  }
}

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */
```
