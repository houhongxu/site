# 45M 跳跃游戏 II

## 解题思路

### 思路一

贪心，每次尽量跳最远的就行

### 代码

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
  if (nums.length === 1) {
    return 0;
  }

  let count = 0;

  for (let i = 0; i < nums.length; ) {
    // 如果当前位置可以跳到最后一个位置，直接结束
    if (i + nums[i] >= nums.length - 1) {
      count++;
      break;
    }

    // 找到当前位置能跳到的最远位置
    let max = i + nums[i];
    let target = i;

    for (let j = i; j <= i + nums[i]; j++) {
      if (j + nums[j] > max) {
        max = j + nums[j];
        target = j;
      }
    }

    i = target;
    count++;
  }

  return count;
};
```
