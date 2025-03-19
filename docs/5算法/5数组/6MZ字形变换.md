# 6MZ 字形变换

## 解题思路

### 思路一

二维数组模拟，额外需要一个 flag 记录上下的方向

### 代码

```js
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function (s, numRows) {
  if (numRows < 2) return s;

  const arr = Array.from({ length: numRows }, () => Array(s.length).fill(null));
  const res = "";

  let i = 0,
    col = 0,
    row = 0,
    downFlag = true;

  while (i < s.length) {
    arr[row][col] = s[i];

    if (downFlag) {
      row++;
    } else {
      row--;
      col++;
    }

    if (downFlag && row === numRows - 1) {
      downFlag = false;
    }

    if (!downFlag && row === 0) {
      downFlag = true;
    }

    i++;
  }

  return arr.flat().join("");
};
```
