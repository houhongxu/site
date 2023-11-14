# 字符串解码

[🔗 LeetCode](https://leetcode.cn/problems/decode-string/)

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。

**示例** 1：

```js
输入：s = "3[a]2[bc]"
输出："aaabcbc"
```

**示例** 2：

```js
输入：s = "3[a2[c]]"
输出："accaccacc"
```

**示例** 3：

```js
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"
```

**示例** 4：

```js
输入：s = "abc3[cd]xyz"
输出："abccdcdcdxyz"
```

**提示**：

- 1 <= s.length <= 30
- s 由小写英文字母、数字和方括号 '[]' 组成
- s 保证是一个 有效 的输入。
- s 中所有整数的取值范围为 [1, 300]

## 解题思路

题目信息：输入字符串中没有额外的空格，数字可能多位，括号可能有多个

### 思路一

遍历 s，遇到数字就单独记录数组，遇到括号则记录括号数量与编码字符串，然后反复处理直到没有括号

### 首次代码

```ts
function decodeString(s: string): string {
  let res = decode(s)
  let count = 10

  while (count-- && res.includes('[')) {
    res = decode(res)
  }

  return res
}

function decode(s: string): string {
  let res = ''
  let num = ''
  let str = ''
  let bracketCount = 0

  for (let i = 0; i < s.length; i++) {
    if (bracketCount === 0 && isOneNumberString(s[i])) {
      num += s[i]
    } else if (s[i] === '[') {
      bracketCount++
      str += s[i]
    } else if (s[i] === ']') {
      bracketCount--
      str += s[i]

      if (bracketCount === 0) {
        let numCount = parseInt(num)

        while (numCount--) {
          res += str.slice(1, -1)
        }

        num = ''
        str = ''
      }
    } else if (bracketCount) {
      str += s[i]
    } else {
      res += s[i]
    }
  }

  return res
}

function isOneNumberString(s: string) {
  if (s.length > 1) return false

  return (
    s.charCodeAt(0) >= '0'.charCodeAt(0) && s.charCodeAt(0) <= '9'.charCodeAt(0)
  )
}
```
