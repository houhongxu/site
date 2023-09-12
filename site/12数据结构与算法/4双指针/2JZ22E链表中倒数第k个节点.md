# 删除链表的节点

[🔗 LeetCode](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。

例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

**示例** 1：

```js
给定一个链表: 1->2->3->4->5, 和 k = 2.

返回链表 4->5.
```

## 解题思路

题目信息：本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点

### 思路一

遍历两次，第一次获取长度，第二次获取对应位置的节点，复杂度 O(n)

### 思路二

双指针，两个指针间距为 k，一起遍历，右边指针到底后返回左边指针，复杂度 O(n)

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

function getKthFromEnd(head: ListNode | null, k: number): ListNode | null {
  let l = head
  let r = head
  let count = 10000

  while (r && k--) {
    r = r.next
  }

  if (!r) return head

  while (r && count--) {
    l = l.next
    r = r.next
  }

  return l
}
```
