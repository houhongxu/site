# 表示数值的字符串

[🔗 LeetCode](https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/)

请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。

数值（按顺序）可以分成以下几个部分：

若干空格
一个 小数 或者 整数
（可选）一个 'e' 或 'E' ，后面跟着一个 整数
若干空格
小数（按顺序）可以分成以下几个部分：

（可选）一个符号字符（'+' 或 '-'）
下述格式之一：
至少一位数字，后面跟着一个点 '.'
至少一位数字，后面跟着一个点 '.' ，后面再跟着至少一位数字
一个点 '.' ，后面跟着至少一位数字
整数（按顺序）可以分成以下几个部分：

（可选）一个符号字符（'+' 或 '-'）
至少一位数字
部分数值列举如下：

["+100", "5e2", "-123", "3.1416", "-1E-16", "0123"]
部分非数值列举如下：

["12e", "1a3.14", "1.2.3", "+-5", "12e+5.4"]

**示例** 1：

```js
输入：s = "0"
输出：true
```

**示例** 2：

```js
输入：s = "e"
输出：false
```

**示例** 3：

```js
输入：s = "."
输出：false
```

**示例** 4：

```js
输入：s = "    .1  "
输出：true
```

**提示**：

- 1 <= s.length <= 20
- s 仅含英文字母（大写和小写），数字（0-9），加号 '+' ，减号 '-' ，空格 ' ' 或者点 '.' 。

## 解题思路

题目信息：1 <= s.length <= 20，s 的范围

### 思路一

模拟题，逻辑复杂，尽量封装

### 首次代码

```ts
function isNumber(s: string): boolean {
  s = s.trim()

  if (!s) return false

  const splitE = (s: string) => {
    if (strIncludeOne(s, 'e')) {
      return s.split('e')
    } else if (strIncludeOne(s, 'E')) {
      return s.split('E')
    } else {
      return []
    }
  }

  const needSplit = s.includes('e') || s.includes('E')

  if (needSplit) {
    const splitedS = splitE(s)
    console.log(splitedS)
    if (
      splitedS.length === 2 &&
      (isDecimal(splitedS[0]) || isInteger(splitedS[0])) &&
      isInteger(splitedS[1])
    ) {
      return true
    } else {
      return false
    }
  }

  return isInteger(s) || isDecimal(s)
}

function isDecimal(s: string) {
  if (s[0] === '+' || s[0] === '-') {
    s = s.slice(1)
  }

  return (
    strIncludeOne(s, '.') &&
    s.length > 1 &&
    s
      .split('.')
      .filter((i) => isInteger(i) && !i.includes('+') && !i.includes('-'))
      .length === s.split('.').filter(Boolean).length
  )
}

function isInteger(s: string) {
  if (s[0] === '+' || s[0] === '-') {
    s = s.slice(1)
  }

  return s.length && s.split('').filter(isStrNumber).length === s.length
}

function isStrNumber(s: string) {
  return 0 <= parseInt(s) && parseInt(s) <= 9
}

function strIncludeOne(s: string, target: string) {
  return s.split('').filter((i) => i === target).length === 1
}
```
