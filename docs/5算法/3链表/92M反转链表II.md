# 92M 反转链表 II

## 解题思路

### 思路一

首先用虚拟头结点来统一处理头节点

先用 left leftNode 和 right rightNode 分离头尾

将中间用 subHead 作为头开始反转链表

然后使用 leftNode 和 rightNode 拼接

### 代码

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  if (left === right) return head;

  const virtualHead = new ListNode(0, head);
  let leftNode = virtualHead;
  let rightNode = head;

  while (left-- > 1) {
    leftNode = leftNode.next;
  }

  while (right-- > 0) {
    rightNode = rightNode.next;
  }

  const subHead = leftNode.next;
  let pre = subHead;
  let cur = pre.next;
  let next = cur.next;

  while (cur !== rightNode) {
    cur.next = pre;

    pre = cur;
    cur = next;
    if (next) {
      next = next.next;
    }
  }

  subHead.next = rightNode;
  leftNode.next = pre;

  return virtualHead.next;
};
```
