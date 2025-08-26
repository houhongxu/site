# 59M 螺旋矩阵 II

## 解题思路

### 思路一

正方形，通过 start 和 end 两个变量就可以限制遍历边界

先都使用<边界来完成最外层遍历
[[1,2],[3,4],[5,6],[7,8]]

然后第一行边界改成<=，来支持填充中心
[[1,2,3],[4],[5,6],[7,8],[9]]

### 代码

```js
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
  let start = 0;
  let end = n - 1;
  let num = 1;

  let result = new Array(n).fill(0).map(() => new Array(n).fill(0));

  while (start <= end) {
    // 第一行<=来填充中心
    for (let i = start; i <= end; i++) {
      result[start][i] = num++;
    }

    for (let i = start + 1; i < end; i++) {
      result[i][end] = num++;
    }

    for (let i = end; i > start; i--) {
      result[end][i] = num++;
    }

    for (let i = end; i > start; i--) {
      result[i][start] = num++;
    }

    start++;
    end--;
  }

  return result;
};
```
