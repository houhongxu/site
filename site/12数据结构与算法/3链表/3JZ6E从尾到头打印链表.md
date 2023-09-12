# 从头到尾打印链表

[🔗 LeetCode](https://leetcode.cn/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

**示例** 1：

```js
输入：head = [1,3,2]
输出：[2,3,1]
```

**限制**：

- 0 <= 链表长度 <= 10000

## 解题思路

### 思路一

遍历链表然后从头插入数组

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

function reversePrint(head: ListNode | null): number[] {
  const res: number[] = []
  while (head) {
    res.unshift(head.val)
    head = head.next
  }

  return res
}
```
