# 95M 不同的二叉搜索树 II

## 解题思路

### 思路一

排列，回溯

用 path 记录路径，通过判断 path 长度跳出递归

通过 used 记录 path 中使用过的避免重复

将 path 转为二叉搜索树

使用前序遍历与 hash 去重二叉搜索树

### 代码

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number} n
 * @return {TreeNode[]}
 */
var generateTrees = function (n) {
  const nums = new Array(n).fill(0).map((item, index) => index + 1);
  const result = [];
  const path = [];
  const used = [...new Array(n)];
  const hash = {};

  const insertNode = (root, val) => {
    if (val < root.val) {
      if (root.left) {
        insertNode(root.left, val);
      } else {
        root.left = new TreeNode(val);
      }
    } else {
      if (root.right) {
        insertNode(root.right, val);
      } else {
        root.right = new TreeNode(val);
      }
    }
  };

  const arrayToTree = (arr) => {
    const root = new TreeNode(arr[0]);

    for (let i = 1; i < arr.length; i++) {
      insertNode(root, arr[i]);
    }

    return root;
  };

  const getKey = (node) => {
    let key = "";

    const traverse = (node) => {
      if (!node) return;
      key += node.val;
      traverse(node.left);
      traverse(node.right);
    };

    traverse(node);

    return key;
  };

  const dfs = () => {
    if (path.length === n) {
      // path 转树
      const head = arrayToTree(path);

      // 前序遍历避免重复的二叉搜索树，如 [2,1,3] 和 [2,3,1]
      const key = getKey(head);

      if (!hash[key]) {
        result.push(head);
        hash[key] = true;
      }

      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;

      path.push(nums[i]);
      used[i] = true;

      dfs();

      path.pop();
      used[i] = false;
    }
  };

  dfs();

  return result;
};
```
