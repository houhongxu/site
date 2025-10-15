# 208M 实现 Trie(前缀树)

## 解题思路

### 思路一

先写 Node 构造函数，需要应该 children 对象或者 Map，还有 isLeaf 标记叶子节点

然后各种方法就都是按层遍历 char，通过 Map 来去下一层

### 代码

```js
function Node() {
  this.children = new Map();
  this.isLeaf = false;
}

var Trie = function () {
  this.root = new Node();
};

/**
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
  let cur = this.root;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    if (!cur.children.has(char)) {
      cur.children.set(char, new Node());
    }

    cur = cur.children.get(char);
  }

  cur.isLeaf = true;
};

/**
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
  let cur = this.root;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    if (!cur.children.has(char)) {
      return false;
    }

    cur = cur.children.get(char);
  }

  return cur.isLeaf;
};

/**
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
  let cur = this.root;

  for (let i = 0; i < prefix.length; i++) {
    const char = prefix[i];

    if (!cur.children.has(char)) {
      return false;
    }

    cur = cur.children.get(char);
  }

  return true;
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
```
