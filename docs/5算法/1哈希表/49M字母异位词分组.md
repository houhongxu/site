# 49M 字母异位词分组

## 解题思路

### 思路一

异位词排序后都长得一样，通过 hash 存排序后的 key 即可

复杂度主要是优化排序算法

### 代码

```js
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  const result = [];
  let hash = {};

  for (let i = 0; i < strs.length; i++) {
    const str = strs[i].split("").sort().join("");

    if (hash[str]) {
      hash[str].push(strs[i]);
    } else {
      hash[str] = [strs[i]];
    }
  }

  return Object.values(hash);
};
```
