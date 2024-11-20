# 左旋转字符串

[🔗 LeetCode](https://leetcode.cn/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字 2，该函数将返回左旋转两位得到的结果"cdefgab"。

**示例** 1：

```js
输入: (s = 'abcdefg'), (k = 2)
输出: 'cdefgab'
```

**示例** 2：

```js
输入: (s = 'lrloseumgh'), (k = 6)
输出: 'umghlrlose'
```

**限制**：

- 1 <= k < s.length <= 10000

**进阶**：

请你设计空间复杂度为 O(1) 的算法解决本问题

## 解题思路

题目信息：若干个

### 思路一

遍历截取左边的字符串加在右边，复杂度 O(n)，空间 O(n)

### 思路二

原地的话，需要先反转整串，再反转左右子串(或者先子后整)，复杂度 O(n)，空间 O(1)

### 首次代码

```ts
function reverseLeftWords(s: string, n: number): string {
  for (let i = 0; i < n; i++) {
    s += s[i]
  }

  return s.slice(n)
}
```

### 优化代码

```ts
function reverseLeftWords(s: string, n: number): string {
  const l = reverseString(s.slice(0, n))
  const r = reverseString(s.slice(n))

  return reverseString(l + r)
}

function reverseString(s: string): string {
  const arr = s.split('')

  for (let l = 0, r = arr.length - 1, t = ''; l < r; l++, r--) {
    t = arr[l]
    arr[l] = arr[r]
    arr[r] = t
  }

  return arr.join('')
}
```
