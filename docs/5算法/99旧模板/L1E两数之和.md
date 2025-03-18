# 两数之和

[🔗 LeetCode](https://leetcode.cn/problems/two-sum/)

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

**示例** 1：

```js
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

**示例** 2：

```js
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例** 3：

```js
输入：nums = [3,3], target = 6
输出：[0,1]
```

**提示**：

- 2 <= nums.length <= 104
- -109 <= nums[i] <= 109
- -109 <= target <= 109
- **只会存在一个有效答案**

**进阶**：你可以想出一个时间复杂度小于 O(n2) 的算法吗？

## 解题思路

题目信息：数组中同一个元素在答案里不能重复出现,任意顺序返回答案,只会存在一个有效答案,时间复杂度小于 O(n2)

### 思路一

暴力解法，双层循环，复杂度 O(n2)

### 思路二

哈希表，通过哈希表 key 记录数组值，value 最好记录数组下标，遍历数组在哈希表内查找(target-当前值)是否存在，返回当前值下标与哈希表找到的下标，复杂度 O(n)

> 注意：数组中同一个元素在答案里不能重复出现

### 首次代码

此解法未记录数组下标，且单独循环一边记录哈希表，多遍历一遍
而且因为避免 数组中同一个元素在答案里不能重复出现 需要特殊处理
代码较为绕

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

哈希表记录数组下标
在循环过程中记录哈希表就可以了
因为返回的是两个数，就算两个数重复，遇到重复数时如果满足条件就返回了，如果不满足，覆盖记录一次这个数也够了

```ts
function twoSum(nums: number[], target: number): number[] {
  let hash = {}

  for (let i = 0; i < nums.length; i++) {
    if (hash[target - nums[i]] !== undefined) {
      return [i, hash[target - nums[i]]]
    }

    hash[nums[i]] = i
  }
  return []
}
```

### 复习代码

```ts
function twoSum(nums: number[], target: number): number[] {
  const num2indexMap = {}

  for (let i = 0; i < nums.length; i++) {
    const needNum = target - nums[i]
    const needIndex = num2indexMap[needNum]
    if (typeof needIndex !== 'undefined') {
      return [needIndex, i]
    }

    num2indexMap[nums[i]] = i
  }

  return []
}
```
