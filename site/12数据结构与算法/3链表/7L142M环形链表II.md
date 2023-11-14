# 环形链表 II\*

[🔗 LeetCode](https://leetcode.cn/problems/linked-list-cycle-ii/)

给定一个链表的头节点 head ，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改 链表。

**示例** 1：

```js
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
```

**示例** 2：

```js
输入：head = [1,2], pos = 0
输出：true
解释：链表中有一个环，其尾部连接到第一个节点。
```

**示例** 3：

```js
输入：head = [1], pos = -1
输出：false
解释：链表中没有环。
```

**提示**：

- 链表中节点的数目范围是 [0, 104]
- -105 <= Node.val <= 105
- pos 为 -1 或者链表中的一个 有效索引 。

**进阶**：

你能用 O(1)（即，常量）内存解决此问题吗？

## 解题思路

题目信息：pos 为 -1 或者链表中的一个 有效索引

### 思路一

快慢指针，如果有环迟早碰到，根据数学公式，快节点走 x+y+n(y+z)，慢节点走 x+y，则 2(x+y)=x+y+n(y+z)，当 n=1 时 x=z，慢节点走到入口和 head 走到入口距离一样

### 思路二

数学方法比较难以想到，而且不通用，哈希法虽然空间复杂度高，但是更通用

### 首次代码

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function detectCycle(head: ListNode | null): ListNode | null {
  if (!head || !head.next) {
    return null
  }

  let fast = head,
    slow = head
  let count1 = 10000

  while (fast && fast.next && slow && count1--) {
    fast = fast.next.next
    slow = slow.next

    if (fast === slow) {
      let count2 = 10000
      let i = head

      while (i !== slow && count2--) {
        i = i.next
        slow = slow.next
      }

      return i
    }
  }

  return null
}
```

### 二次代码

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function detectCycle(head: ListNode | null): ListNode | null {
  const map = new Map()
  let count = 10000
  let h = head

  while (h && count--) {
    if (map.has(h)) return h

    map.set(h, 1)

    h = h.next
  }

  return null
}
```
