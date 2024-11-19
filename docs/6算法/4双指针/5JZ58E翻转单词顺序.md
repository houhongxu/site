# 翻转单词顺序

[🔗 LeetCode](https://leetcode.cn/problems/fan-zhuan-dan-ci-shun-xu-lcof/)

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

**示例** 1：

```js
输入: 'the sky is blue'
输出: 'blue is sky the'
```

**示例** 2：

```js
输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
```

**示例** 3：

```js
输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```

**说明**：

- 无空格字符构成一个单词。
- 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
- 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

## 解题思路

题目信息：两个单词间有多余的空格，减少到一个

### 思路一

直接用 api

### 思路二

遍历实现 split 将字符串分成数组，然后双指针实现 reverse，然后实现拼接

### 首次代码

```ts
function reverseWords(s: string): string {
  return s.split(' ').filter(Boolean).reverse().join(' ')
}
```
