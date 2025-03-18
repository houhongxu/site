# 调整数组顺序使奇数位于偶数前面

[🔗 LeetCode](https://leetcode.cn/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/)

输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分。

**示例** 1：

```js
输入：nums = [1,2,3,4]
输出：[1,3,2,4]
注：[3,1,2,4] 也是正确的答案之一。
```

**限制**：

- 0 <= nums.length <= 50000
- 0 <= nums[i] <= 10000

## 解题思路

题目信息：前半和后半

### 思路一

双指针，两遍向里面遍历调换位置，复杂度 O(n)

### 首次代码

```ts
function exchange(nums: number[]): number[] {
  for (let i = 0, j = nums.length - 1; i < j; ) {
    if (isEven(nums[i]) && isOdd(nums[j])) {
      let t = nums[i]
      nums[i] = nums[j]
      nums[j] = t
    } else {
      if (isOdd(nums[i])) {
        i++
      }

      if (isEven(nums[j])) {
        j--
      }
    }
  }

  return nums
}

function isOdd(n: number) {
  return n % 2 === 1
}

function isEven(n: number) {
  return n % 2 === 0
}
```
