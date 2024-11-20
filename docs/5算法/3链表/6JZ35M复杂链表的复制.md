# 复杂链表的复制

[🔗 LeetCode](https://leetcode.cn/problems/fu-za-lian-biao-de-fu-zhi-lcof/)

请实现 copyRandomList 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 next 指针指向下一个节点，还有一个 random 指针指向链表中的任意节点或者 null。

**示例** 1：

```js
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例** 2：

```js
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例** 3：

```js
输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]
```

**示例** 4：

```js
输入：head = []
输出：[]
解释：给定的链表为空（空指针），因此返回 null。
```

**提示**：

- -10000 <= Node.val <= 10000
- Node.random 为空（null）或指向链表中的节点。
- 节点数目不超过 1000 。

## 解题思路

题目信息：random 指针指向链表中的任意节点或者 null

### 思路一

遍历第一遍构造哈希建立新旧节点映射，然后遍历第二遍的同时给 next 与 random 赋值，复杂度 O(n)

### 首次代码

```js
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function (head) {
  if (!head) return head

  const map = new Map()

  for (let i = head; i; i = i.next) {
    map.set(i, copyNode(i))
  }

  let copyHead = map.get(head)

  for (let i = head, j = copyHead; i; i = i.next, j = j.next) {
    if (map.get(i.next)) {
      j.next = map.get(i.next)
    }
    j.random = map.get(i.random)
  }

  return copyHead
}

/**
 * @param {Node} node
 * @return {Node}
 */
var copyNode = function (node) {
  return new Node(node.val, null, null)
}
```
