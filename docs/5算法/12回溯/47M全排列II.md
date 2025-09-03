# 47M 全排列 II

## 解题思路

### 思路一

排列，回溯

用 path 记录路径，通过判断 path 长度跳出递归

通过 used 记录 path 中使用过的避免重复

如果之前的数字使用过，跳过重复数字

### 代码

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  nums.sort((a, b) => a - b);

  const result = [];
  const path = [];
  const used = [...new Array(nums.length)];

  const dfs = () => {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      // 如果之前的数字使用过，跳过重复数字
      if (i > 0 && used[i - 1] && nums[i] === nums[i - 1]) {
        continue;
      }

      if (used[i]) {
        continue;
      }

      used[i] = true;

      path.push(nums[i]);

      dfs();

      path.pop();

      used[i] = false;
    }
  };

  dfs();

  return result;
};
```
