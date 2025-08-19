# 34M在排序数组中查找元素的第一个和最后一个位置

## 解题思路

### 思路一

二分查找

### 代码

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  for (let i = 0, j = nums.length - 1; i <= j; ) {
    if (nums[i] === target && nums[j] === target) {
      return [i, j];
    }

    if (nums[i] === target) {
      j--;
    } else if (nums[j] === target) {
      i++;
    } else {
      i++;
      j--;
    }
  }

  return [-1, -1];
};
```
