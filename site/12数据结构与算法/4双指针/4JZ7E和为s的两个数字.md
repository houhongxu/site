# 和为 s 的两个数字

[🔗 LeetCode](https://leetcode.cn/problems/he-wei-sde-liang-ge-shu-zi-lcof/)

输入一个递增排序的数组和一个数字 s，在数组中查找两个数，使得它们的和正好是 s。如果有多对数字的和等于 s，则输出任意一对即可。

**示例** 1：

```js
输入：nums = [2,7,11,15], target = 9
输出：[2,7] 或者 [7,2]
```

**示例** 2：

```js
输入：nums = [10,26,30,31,47,60], target = 40
输出：[10,30] 或者 [30,10]
```

**限制**：

- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^6

## 解题思路

题目信息：递增，结果不计顺序

### 思路一

哈希表，复杂度 O(n)

### 思路二

因为递增，不是两数之和那种随机，所以可以双指针从两边缩小范围，复杂度 O(n)

### 首次代码

```ts
function twoSum(nums: number[], target: number): number[] {
  let map = {}
  nums.forEach((num) => (map[num] ? map[num]++ : (map[num] = 1)))

  let res = []
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]]--
    if (map[target - nums[i]]) {
      res.push(i)
    }
    map[nums[i]]++
  }
  return res
}
```

### 代码优化

```ts
function twoSum(nums: number[], target: number): number[] {
  let i = 0,
    j = nums.length - 1
  let count = 100000

  while (i < j && count--) {
    console.log(nums[i], nums[j])
    if (target > nums[i] + nums[j]) {
      i++
    } else if (target < nums[i] + nums[j]) {
      j--
    } else if (target === nums[i] + nums[j]) {
      return [nums[i], nums[j]]
    }
  }

  return []
}
```
