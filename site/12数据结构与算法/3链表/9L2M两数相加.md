# 两数相加

[🔗 LeetCode](https://leetcode.cn/problems/add-two-numbers/)

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

**示例** 1：

```js
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

**示例** 2：

```js
输入：l1 = [0], l2 = [0]
输出：[0]
```

**示例** 3：

```js
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

**提示**：

- 每个链表中的节点数在范围 [1, 100] 内
- 0 <= Node.val <= 9
- 题目数据保证列表表示的数字不含前导零

## 解题思路

题目信息：非空，逆序，数字 0 开头则为 0

### 思路一

遍历两个链表时相加并进位生成一个新链表，就是加法就进位，复杂度 O(n)

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

function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  let virtualHead = new ListNode()
  let bit = 0
  let count = 100
  let i = virtualHead

  while ((l1 || l2) && count--) {
    let sum = 0

    if (l1 && l2) {
      sum = l1.val + l2.val
      l1 = l1.next
      l2 = l2.next
    } else if (l1 && !l2) {
      sum = l1.val
      l1 = l1.next
    } else if (l2 && !l1) {
      sum = l2.val
      l2 = l2.next
    }

    sum += bit
    bit = 0

    if (sum > 9) {
      sum = sum % 10
      bit = 1
    }

    i.next = new ListNode(sum)
    i = i.next
  }

  if (bit) {
    i.next = new ListNode(1)
  }

  return virtualHead.next
}
```
