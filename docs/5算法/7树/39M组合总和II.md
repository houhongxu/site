# 39M 组合总和 II

## 解题思路

### 思路一

递归的回溯，首先排序，这样可以使用 target 一直减 current 来跳出递归，如果不排序则需要计算 sum。然后需要用 path 数组记录路径，在满足条件后收集 path 到 result

注意 path 需要拷贝，以及 dfs 时 candidates 跟随遍历来 slice 避免重复

还需要额外注意遍历时跳过重复数字

### 代码

```js
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
  candidates.sort((a, b) => a - b);

  let result = [];
  let path = [];

  const dfs = (candidates, target) => {
    for (let i = 0; i < candidates.length; i++) {
      if (i > 0 && candidates[i] === candidates[i - 1]) {
        continue;
      }

      const current = candidates[i];

      if (target < current) {
        return;
      }

      path.push(current);

      if (target === current) {
        // 拷贝path避免存入的是引用
        result.push([...path]);
      }

      // slice避免重复
      dfs(candidates.slice(i + 1), target - current);

      path.pop(current);
    }
  };

  dfs(candidates, target);

  return result;
};
```
