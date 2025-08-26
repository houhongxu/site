# 47M 全排列 II

## 解题思路

### 思路一

递归的回溯，用 path 记录路径，通过判断 path 长度跳出递归

首先 path 不能根据值去重了，改成根据 index 去重，但是这样还是会出现多个因为值重复而重复的，result 通过 set 去重字符串的方式再值去重

### 代码

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  // 值去重
  let result = new Set();
  // 索引去重
  let indexPath = [];

  const dfs = () => {
    if (indexPath.length === nums.length) {
      result.add(JSON.stringify(indexPath.map((i) => nums[i])));
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (indexPath.includes(i)) {
        continue;
      }

      indexPath.push(i);

      dfs();

      indexPath.pop();
    }
  };

  dfs(nums);

  return Array.from(result).map((item) => JSON.parse(item));
};
```
