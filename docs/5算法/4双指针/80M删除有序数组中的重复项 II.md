# 80M 删除有序数组中的重复项 II

## 解题思路

### 思路一

首先遍历第一遍标记超过两个的数字为 x

然后遍历第二遍进行 x 和下一个有效数字替换

最后 filter 去掉 x

### 代码

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let cur;
  let count;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== cur) {
      cur = nums[i];
      count = 1;
    } else {
      count++;
    }

    if (count > 2) {
      nums[i] = "x";
    }
  }

  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === "x") {
      let j = i + 1;

      while (j < nums.length - 1 && nums[j] === "x") {
        j++;
      }

      nums[i] = nums[j];
      nums[j] = "x";
    }
  }

  nums = nums.filter((item) => item !== "x");

  return nums.length;
};
```

### 思路二

双指针

[1,1,1,2,2,3]

题目是数组有序且结果数组里数字最多两个

那么只需要满足 i 和 i+2 不同，或者是 i 和 i-2 不同

left 记录结果数组，right 去找新数字

所以 nums[left-2]!==nums[right]时，nums[right]是新数字，将 right 赋值到 left，就满足了 i 和 i-2 不同

### 代码

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let left = 2;
  let right = 2;

  while (right < nums.length) {
    // right是新数字时，将right赋值给left即可
    if (nums[right] !== nums[left - 2]) {
      nums[left] = nums[right];
      left++;
    }

    right++;
  }

  return left;
};
```
