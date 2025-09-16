# 147M 对链表进行插入排序

## 解题思路

> 注意 leetcode 测试用例 22 使用 JavaScript 超时，用灵茶山学府的代码也不行，应该是官方问题

### 思路一

因为读写都限制复杂度 O(1)

所以首先考虑就是 hash，使用 map 而不是对象来提高性能

另外因为需要记录最久未使用的节点来删除，就是每次读写节点需要排序节点使用新旧，使用数组的话因为排序需要更新 index，复杂度不可能满足，所以需要使用双向链表，头结点是新的，尾节点是旧的，每次读写将节点移动到头节点，其他节点的顺序就自动顺延

单向链表可以做，但是因为需要频繁访问操作节点的前一个节点，比较麻烦，不如双向链表

双向链表为了方便操作头尾，头尾都使用了虚拟节点

具体操作可以封装为 removeNode、addNodeToHead、moveNodeToHead、removeTailNode 这几个函数

get 时调用 moveNodeToHead 然后返回值即可

put 时判断如果有 hash，就更新值然后 moveNodeToHead
没有就判断 length 是否超过 capacity，超过就 removeTailNode，然后 addNodeToHead

### 代码

```js
class Node {
  constructor(key, value, next, prev) {
    this.key = key;
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.capacity = capacity;

  this.map = new Map();

  // 虚拟头节点，双向链表
  this.virtualHead = new Node(0, 0, null, null);
  this.virtualTail = new Node(0, 0, null, null);

  this.virtualHead.next = this.virtualTail;
  this.virtualTail.prev = this.virtualHead;

  this.length = 0;
};

LRUCache.prototype.removeNode = function (node) {
  const prev = node.prev;
  const next = node.next;

  prev.next = next;
  next.prev = prev;

  node.next = null;
  node.prev = null;
};

LRUCache.prototype.addNodeToHead = function (node) {
  const head = this.virtualHead.next;

  head.prev = node;
  node.next = head;

  node.prev = this.virtualHead;
  this.virtualHead.next = node;
};

LRUCache.prototype.moveNodeToHead = function (node) {
  if (node === this.virtualHead.next) {
    return;
  }

  this.removeNode(node);
  this.addNodeToTail(node);
};

LRUCache.prototype.removeTailNode = function () {
  const tail = this.virtualTail.prev;

  this.map.delete(tail.key);

  this.removeNode(tail);

  this.length--;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  const node = this.map.get(key);

  if (node) {
    this.moveNodeToHead(node);

    return node.value;
  } else {
    return -1;
  }
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  const node = this.map.get(key);

  if (node) {
    node.value = value;

    this.moveNodeToHead(node);
  } else {
    // 删除最久未使用的节点
    if (this.length >= this.capacity) {
      this.removeTailNode();
    }

    // 插入新节点
    const newNode = new Node(key, value, null, null);

    this.map.set(key, newNode);

    this.addNodeToTail(newNode);

    this.length++;
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```
