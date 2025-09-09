# 93M 复原 IP 地址

## 解题思路

### 思路一

组合，回溯

用 path 记录路径，通过判断 path 长度跳出递归

当 path 为 4 且 index 走完时，压入 result

### 代码

```js
const result = [];
const path = [];

const isValid = (s) => {
  if (s.length > 3) return false;
  if (s.length > 1 && s[0] === "0") return false;

  return parseInt(s) <= 255;
};

const dfs = (index) => {
  if (path.length > 4) return;

  if (index === s.length && path.length === 4) {
    result.push(path.join("."));
    return;
  }

  const one = s.slice(index, index + 1);
  const two = s.slice(index, index + 2);
  const three = s.slice(index, index + 3);

  if (isValid(one)) {
    path.push(one);
    dfs(index + 1);
    path.pop();
  }

  if (isValid(two)) {
    path.push(two);
    dfs(index + 2);
    path.pop();
  }

  if (isValid(three)) {
    path.push(three);
    dfs(index + 3);
    path.pop();
  }
};

dfs(0);

return result;
```
