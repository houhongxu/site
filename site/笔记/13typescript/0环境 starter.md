# 环境 starter

## 插件

类型导入提示不清晰可以考虑 typescript importer

## declare

用于存放 TypeScript 类型信息的内存空间

```ts
interface Res {
  code: 10000 | 10001 | 50000
  status: 'success' | 'failure'
  data: any
}

declare var res: Res

if (res.status === 'success') {
  return
}
```

res 的类型会有类型提示，declare 快速生成了一个符合指定类型，但没有实际值的变量，同时它也不存在于运行时中
