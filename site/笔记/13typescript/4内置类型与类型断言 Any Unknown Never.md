# 内置类型与类型断言 Any Unknown Never

## 内置类型

### any

let 与函数参数等具有隐性 any

noImplicitAny 配置隐性 any 是否报错，推荐开启

any 放弃所有类型检查

### unknown

unknown 还有类型检查

通过类型断言赋值使用

### never

可以通过 never 进行类型检查报错

```ts
declare const strOrNumOrBool: string | number | boolean

if (typeof strOrNumOrBool === 'string') {
  // 一定是字符串！
  strOrNumOrBool.charAt(1)
} else if (typeof strOrNumOrBool === 'number') {
  strOrNumOrBool.toFixed()
} else if (typeof strOrNumOrBool === 'boolean') {
  strOrNumOrBool === true
} else {
  const _exhaustiveCheck: never = strOrNumOrBool
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`)
}
```

## 类型断言

可以在保留类型提示的前提下，不那么完整地实现这个结构

```ts
interface IStruct {
  foo: string
  bar: {
    barPropA: string
  }
}

const obj: IStruct = {} // 报错
const obj = {} as IStruct //不用每个属性都初始化
```

### 双重断言

先断言到 unknown 类型，再断言到预期类型

### 非空断言

## 类型层级

any/unkonwn->Object->String/Boolean/Number->原始类型与对象类型->字面量类型->never
