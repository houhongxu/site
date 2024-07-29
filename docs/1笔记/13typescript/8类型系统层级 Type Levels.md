# 类型系统层级 Type Levels

类型层级实际上指的是，TypeScript 中所有类型的兼容关系，从最上面一层的 any 类型，到最底层的 never 类型

## 判断类型兼容性的方式

### 条件类型

`type Result = 'linbudu' extends string ? 1 : 2`

### 赋值

```ts
declare let source: string
declare let anyType: any
declare let neverType: never

anyType = source

// 不能将类型“string”分配给类型“never”。
neverType = source
```

类似于：

- 狗 = 柯基 √
- 狗 = 橘猫 ×

## 原始类型

字面量类型 < 对应的原始类型

## 联合类型

字面量类型 < 包含此字面量类型的联合类型（同一基础类型） < 对应的原始类型

## 装箱类型

字面量类型 < 包含此字面量类型的联合类型（同一基础类型） < 对应的原始类型 < 原始类型对应的装箱类型 < Object 类型

### {} 的特殊

`String extends {}`
因为是结构化类型系统的比较
String 是具有特殊方法的{}

```ts
// 类型信息和结构化类型
type Result16 = {} extends object ? 1 : 2 // 类型信息：字面量<原始类型
type Result18 = object extends {} ? 1 : 2 // 结构化类型：对象都是{}的子类型

type Result19 = Object extends {} ? 1 : 2 // 类型信息：字面量<原始类型<装箱类型
type Result21 = {} extends Object ? 1 : 2 // 结构化类型：对象都是{}的子类型

// 设定问题
type Result17 = object extends Object ? 1 : 2 // Object 包含了所有除 Top Type 以外的类型（基础类型、函数类型等）
type Result20 = Object extends object ? 1 : 2 // object 包含了所有非原始类型的类型，即数组、对象与函数类型
```

## Top Type

- any：any 可以表达为任何类型，包括 unknown

- unknown

`type Result24 = any extends Object ? 1 : 2; // 1 | 2`

Object < any / unknown

## Bottom Level

never < 字面量类型

## 类型层级链

```ts
type VerboseTypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | 'budulin'
    ? 'linbudu' | 'budulin' extends string
      ? string extends {}
        ? string extends String
          ? String extends {}
            ? {} extends object
              ? object extends {}
                ? {} extends Object
                  ? Object extends {}
                    ? object extends Object
                      ? Object extends object
                        ? Object extends any
                          ? Object extends unknown
                            ? any extends unknown
                              ? unknown extends any
                                ? 8
                                : 7
                              : 6
                            : 5
                          : 4
                        : 3
                      : 2
                    : 1
                  : 0
                : -1
              : -2
            : -3
          : -4
        : -5
      : -6
    : -7
  : -8
```
