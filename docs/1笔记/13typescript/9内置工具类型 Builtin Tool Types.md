# 内置工具类型 Builtin Tool Types

- 属性修饰工具类型：对属性的修饰，包括对象属性和数组元素的可选/必选、只读/可写
- 结构工具类型：对既有类型的裁剪、拼接、转换等，比如使用对一个对象类型裁剪得到一个新的对象类型，将联合类型结构转换到交叉类型结构
- 集合工具类型：对集合（即联合类型）的处理，即交集、并集、差集、补集
- 模式匹配工具类型：基于 infer 的模式匹配，即对一个既有类型特定位置类型的提取，比如提取函数类型签名中的返回值类型
- 模板字符串工具类型：模板字符串专属的工具类型，比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式

## 属性修饰工具类型

### 访问性修饰工具类型

```ts
type Partial<T> = {
  [P in keyof T]?: T[P] | undefined
}

type Required<T> = {
  [P in keyof T]-?: T[P]
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

### 结构类型工具

#### 结构声明

```ts
type Record<K extends string | number | symbol, T> = {
  [P in K]: T
}
```

#### 结构处理

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Omit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P]
}
```

### 集合工具类型

```ts
// 差集：T中有而U中没有的，T排除U
type Exclude<T, U> = T extends U ? never : T

// 交集：T和U都有的
type Extract<T, U> = T extends U ? T : never
```

这里的具体实现其实就是**条件类型的分布式特性**，即当 **T、U 都是联合类型**（视为一个集合）时，T 的成员会依次被拿出来进行 extends U ? T1 : T2 的计算，然后将最终的结果再合并成联合类型。

而并集就是联合类型

### 模式匹配工具类型

```ts
type FunctionType = (...args: any) => any

type Parameters<T extends FunctionType> = T extends (...args: infer P) => any
  ? P
  : never

type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R
  ? R
  : any
```
