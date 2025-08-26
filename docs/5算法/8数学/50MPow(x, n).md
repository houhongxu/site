# 50M Pow(x, n)

## 解题思路

### 思路一

按照题意实现即可，先单独判断负数和分数，然后判断极限条件，然后计算，最后加上负数或者分数即可

### 代码

```js
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  const isDivide = n < 0;
  let absN = Math.abs(n);

  const isNegative = x < 0 && n % 2 !== 0;
  const absX = Math.abs(x);

  if (absX >= 2 && absN >= 31) {
    return 0;
  }

  if (absX === 0 || absX === 1) {
    return isNegative ? -absX : absX;
  }

  let result = 1;

  while (absN > 0) {
    result *= absX;
    absN--;
  }

  if (isNegative) {
    result = -result;
  }

  return isDivide ? 1 / result : result;
};
```
