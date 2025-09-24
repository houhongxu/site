# 187M 重复的 DNA 序列

## 解题思路

### 思路一

哈希

直接遍历，dna 就是 i 到 i+10，如果 hash 有且 result 没有就存入 result，否则存入 hash

### 代码

```js
/**
 * @param {string} s
 * @return {string[]}
 */
var findRepeatedDnaSequences = function (s) {
  const result = [];
  const hash = {};

  for (let i = 0; i < s.length; i++) {
    const dna = s.slice(i, i + 10);

    if (hash[dna] && !result.includes(dna)) {
      result.push(dna);
    }

    hash[dna] = true;
  }

  return result;
};
```
