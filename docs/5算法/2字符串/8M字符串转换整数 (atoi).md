# 15M 三数之和

## 解题思路

### 思路一

就是按题目要求模拟，先 trim 或者手写函数去空格，然后写个 isNumberStr 判断是不是数字，收集数字字符串，然后字符串转数字，然后判断有没有超过值范围

### 代码

```js
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  s = s.trim();

  const isNumberStr = (str) => {
    if (str.length > 1) return false;

    if (
      "0".charCodeAt() <= str.charCodeAt() &&
      str.charCodeAt() <= "9".charCodeAt()
    ) {
      return true;
    }

    return false;
  };

  const str2num = (str) => {
    if (str === "") return 0;

    let num = 0;
    let power = 0;

    for (let i = str.length - 1; i >= 0; i--) {
      num += str[i] * Math.pow(10, power++);
    }

    return num;
  };

  let pureStr = "";
  let flag = true;

  for (let i = 0; i < s.length; i++) {
    if (isNumberStr(s[i])) {
      pureStr += s[i];
    } else {
      if (i === 0 && s[i] === "+") {
        flag = true;

        continue;
      }

      if (i === 0 && s[i] === "-") {
        flag = false;
        continue;
      }

      break;
    }
  }

  const pureNum = str2num(pureStr);
  const num = flag ? pureNum : -pureNum;

  if (num > Math.pow(2, 31) - 1) return Math.pow(2, 31) - 1;

  if (num < -Math.pow(2, 31)) return -Math.pow(2, 31);

  return num;
};
```
