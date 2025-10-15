# 131M 分割回文串

## 解题思路

### 思路一

组合，回溯

遍历 1-9 是有序的，使用 start 记录位置，使用 target 一直减 i 来给下面跳出递归提供条件

然后需要用 path 数组记录路径，在满足 path 长度为 k 且 target 为 0 时收集 path 到 result 然后跳出递归

注意 path 需要拷贝

以及 dfs 时 i 跟随遍历来 i+1，因为结果数组数字不可以重复

### 代码

```js
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function (k, n) {
  const result = [];
  const path = [];

  const dfs = (start, target) => {
    if (path.length === k && target === 0) {
      result.push([...path]);
      return;
    }

    for (let i = start; i <= 9; i++) {
      path.push(i);

      dfs(i + 1, target - i);

      path.pop();
    }
  };

  dfs(1, n);

  return result;
};
```
