# 63M 不同路径 II

## 解题思路

### 思路一

动态规划，在不同路径的基础上加了石头

方程不变

初始化，因为石头阻碍了路径，首先将石头填入 0，其他为空
在最右边时因为只能向下，石头会挡住，所以右边框下到上遍历，遇到石头之后后面都填入零
下边框同理

### 代码

```js
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
  const dp = obstacleGrid.map((item) =>
    item.map((item) => (item === 1 ? 0 : undefined))
  );

  const m = dp.length;
  const n = dp[0].length;

  let bottomFlag = false;
  let rightFlag = false;

  // 遇到0后面都是0
  for (let i = n - 1; i >= 0; i--) {
    if (dp[m - 1][i] === 0) {
      bottomFlag = true;
    }

    dp[m - 1][i] = bottomFlag ? 0 : 1;
  }

  for (let i = m - 1; i >= 0; i--) {
    if (dp[i][n - 1] === 0) {
      rightFlag = true;
    }

    dp[i][n - 1] = rightFlag ? 0 : 1;
  }

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (typeof dp[i][j] !== "number") {
        dp[i][j] = dp[i + 1][j] + dp[i][j + 1];
      }
    }
  }

  return dp[0][0];
};
```
