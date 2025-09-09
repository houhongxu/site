# 78M 子集

## 解题思路

### 思路一

组合，回溯

用 path 记录路径，通过判断 path 长度跳出递归

通过 arr.slice(i + 1)来避免重复选择 arr[i]

与组合的区别是每次都收集 path，在长度最大时终止递归

因为 nums 数字会重复，所以跳过重复数字

### 代码

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function (nums) {
  nums.sort((a, b) => a - b);

  const result = [];
  const path = [];

  const dfs = (arr) => {
    result.push([...path]);

    for (let i = 0; i < arr.length; i++) {
      if (i > 0 && arr[i] === arr[i - 1]) {
        continue;
      }

      path.push(arr[i]);
      dfs(arr.slice(i + 1));
      path.pop();
    }
  };

  dfs(nums);

  return result;
};
```
