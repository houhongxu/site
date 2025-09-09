# 82M 删除排序链表中的重复元素 II

## 解题思路

### 思路一

首先用虚拟头结点来统一处理头节点

使用左中右三个指针，左指针代表结果链表

中右指针为两个互相比较的节点，从 1，2 开始循环处理，如果中=右则向后直到中!=右，让左链接到右

如果一开始就中!=右，则左直接链接到中

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
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
  if (!head) return head;

  let left = new ListNode(0, head);
  const virtualHead = left;

  while (left.next && left.next.next) {
    let middle = left.next;
    let right = middle.next;

    let flag = false;

    if (middle.val === right.val) {
      while (right && middle.val === right.val) {
        middle = middle.next;
        right = right.next;
      }

      left.next = right;
    } else {
      left = middle;
    }
  }

  return virtualHead.next;
};
```
