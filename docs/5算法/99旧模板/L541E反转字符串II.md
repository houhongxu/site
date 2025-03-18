# 反转字符串 II\*

[🔗 LeetCode](https://leetcode.cn/problems/reverse-string-ii/)

给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符。

如果剩余字符少于 k 个，则将剩余字符全部反转。
如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。

**示例** 1：

```js
输入：s = "abcdefg", k = 2
输出："bacdfeg"
```

**示例** 2：

```js
输入：s = "abcd", k = 2
输出："bacd"
```

**提示**：

- 1 <= s.length <= 104
- s 仅由小写英文组成
- 1 <= k <= 104

## 解题思路

题目信息：0~k-1,2k~3k-1...，两个如果单独处理

### 思路一

使用数组遍历，遍历的同时反转下标 0~k-1,2k~3k-1 等子数组，实现的反转函数需要根据左右下标反转

### 首次代码

```ts
function reverseStr(s: string, k: number): string {
  const arr = Array.from(s)
  const remain = s.length % (2 * k)

  for (let i = 0; i + 2 * k <= s.length; i += 2 * k) {
    reverseString(arr, i, i + k - 1)
  }

  if (remain < k) {
    reverseString(arr, s.length - remain, s.length - 1)
  }

  if (remain >= k) {
    reverseString(arr, s.length - remain, s.length - remain + k - 1)
  }

  return arr.join('')
}

function reverseString(s: string[], l: number, r: number): string[] {
  for (let t = ''; l < r; l++, r--) {
    t = s[l]
    s[l] = s[r]
    s[r] = t
  }
  return s
}
```
