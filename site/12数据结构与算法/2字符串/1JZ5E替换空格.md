# 替换空格

[🔗 LeetCode](https://leetcode.cn/problems/ti-huan-kong-ge-lcof/)

请实现一个函数，把字符串 s 中的每个空格替换成"%20"。

**示例** 1：

```js
输入：s = "We are happy."
输出："We%20are%20happy."
```

**限制**：

- 0 <= s 的长度 <= 10000

## 解题思路

题目尽量不用 api

### 思路一

暴力解第一反应肯定是 api，split、join、replace、正则都可以，但是算法需要尽量不用 api

### 思路二

遍历时替换，复杂度 O(n)

### 首次代码

```ts
function replaceSpace(s: string): string {
  return s.replaceAll(' ', '%20')
}
```

### 代码优化

```ts
function replaceSpace(s: string): string {
  let res = ''

  for (let i = 0; i < s.length; i++) {
    if (s[i] === ' ') {
      res += '%20'
    } else {
      res += s[i]
    }
  }

  return res
}
```
