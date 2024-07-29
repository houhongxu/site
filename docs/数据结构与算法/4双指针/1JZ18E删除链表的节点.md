# 删除链表的节点

[🔗 LeetCode](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。

返回删除后的链表的头节点。

注意：此题对比原题有改动

**示例** 1：

```js
输入: head = [4,5,1,9], val = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
```

**示例** 2：

```js
输入: head = [4,5,1,9], val = 1
输出: [4,5,9]
解释: 给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.
```

**说明**：

- 题目保证链表中节点的值互不相同
- 若使用 C 或 C++ 语言，你不需要 free 或 delete 被删除的节点

## 解题思路

题目信息：节点值不同

### 思路一

双指针遍历删的时候保证不断，用虚拟头结点保证第一个值也可以遍历到，复杂度 O(n)

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

function deleteNode(head: ListNode | null, val: number): ListNode | null {
  if (!head) return head

  const virtualHead = new ListNode()
  virtualHead.next = head

  let count = 10000
  let l = virtualHead
  let r = virtualHead.next

  while (r && count--) {
    if (r.val === val) {
      l.next = r.next
      return virtualHead.next
    } else {
      r = r.next
      l = l.next
    }
  }

  return virtualHead.next
}
```
