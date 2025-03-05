# babel

babel 经常会在 webpack 配置中见到

可以说是一个核心配置了，没有 babel 的话 webpack 的生态可以说缺失了很大一块

babel 的作用其实很简单，es5+ -> es5 或者 ts -> js，代码转换而已

但是又很复杂，因为涉及到了 ast 抽象语法树，以及语言的版本和 pollyfill 垫片

pollyfill 又涉及到了 core-js 标准库

先简单来看一下流程

## 流程

babel 的流程可以分为三部分

- parser（@babel/parser）
- traverse @babel/traverse）
- generator（@babel/generator）

可以对应为

- js->ast
- ast->ast
- ast->js（副产物 sourcemap）

首先看看 parser

### @babel/parser

@babel/parser 会将 js 代码解析为 babel ast

他会比 标准 estree 多一些属性，如果想获取 标准 estree 可以使用 acorn

#### 常见属性名词

- Program 程序 顾名思义，整个代码都是
- Declaration/Declarator 声明语句 如`function` `const`
- Identifier 标识符 如 `const a = 1` 里的 a，如`console.log(1)`里面的 console 和 log，其实就是所有变量
- Statement 语句 如`{}` `return`，是程序的基本构成
- Expression 表达式 如`tips.forEach()` `a?1:2`，就是可以 return 的那些
- Literal 字面量 如 `const a = 1` 里的 1，其实就是写死的常量

#### babel ast 和 estree 的不同

其实最明显的不同就是字面量了，babel ast 的字面量比较详细

- Literal -> StringLiteral NumericLiteral BigIntLiteral, BooleanLiteral NullLiteral RegExpLiteral
- Property -> ObjectProperty ObjectMethod
- MethodDefinition -> ClassMethod ClassPrivateMethod
- PropertyDefinition -> ClassProperty ClassPrivateProperty
- PrivateIdentifier -> PrivateName
- Program and BlockStatement + Directive DirectiveLiteral
- FunctionExpression 简化 ClassMethod ClassPrivateMethod ObjectProperty ObjectMethod
- ChainExpression -> OptionalMemberExpression OptionalCallExpression
- ImportExpression -> CallExpression （Babel 8 之前）
- ExportAllDeclaration -> ExportNamedDeclaration

#### 解析流程

对了，@babel/parser 本身就是重度参考 acorn

解析过程分为两步

##### 词法分析

js->token

```js
[
  // const
  {
    type: {
      label: "const",
      keyword: "const",
      beforeExpr: false,
      startsExpr: false,
      rightAssociative: false,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: null,
    },
    value: "const",
    start: 0,
    end: 5,
    loc: {
      start: {
        line: 1,
        column: 0,
        index: 0,
      },
      end: {
        line: 1,
        column: 5,
        index: 5,
      },
    },
  },

  // a
  {
    type: {
      label: "name",
      beforeExpr: false,
      startsExpr: true,
      rightAssociative: false,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: null,
    },
    value: "a",
    start: 6,
    end: 7,
    loc: {
      start: {
        line: 1,
        column: 6,
        index: 6,
      },
      end: {
        line: 1,
        column: 7,
        index: 7,
      },
    },
  },
  // =
  {
    type: {
      label: "=",
      beforeExpr: true,
      startsExpr: false,
      rightAssociative: false,
      isLoop: false,
      isAssign: true,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: null,
    },
    value: "=",
    start: 8,
    end: 9,
    loc: {
      start: {
        line: 1,
        column: 8,
        index: 8,
      },
      end: {
        line: 1,
        column: 9,
        index: 9,
      },
    },
  },
  // 1
  {
    type: {
      label: "num",
      beforeExpr: false,
      startsExpr: true,
      rightAssociative: false,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: null,
    },
    value: 1,
    start: 10,
    end: 11,
    loc: {
      start: {
        line: 1,
        column: 10,
        index: 10,
      },
      end: {
        line: 1,
        column: 11,
        index: 11,
      },
    },
  },
  // end of file
  {
    type: {
      label: "eof",
      beforeExpr: false,
      startsExpr: false,
      rightAssociative: false,
      isLoop: false,
      isAssign: false,
      prefix: false,
      postfix: false,
      binop: null,
      updateContext: null,
    },
    start: 11,
    end: 11,
    loc: {
      start: {
        line: 1,
        column: 11,
        index: 11,
      },
      end: {
        line: 1,
        column: 11,
        index: 11,
      },
    },
  },
];
```

就是将代码的单词一个个分析为上面这样的 token 数组，给 ast 做准备

#### 语法分析

token->ast

简单看一下 `const a = 1` 这个声明

```js
import { parse } from "@babel/parser";

const jsCodeString = "const a = 1";

const babelAst = parse(jsCodeString);

console.log(JSON.stringify(babelAst, null, 2));

{
  "type": "File", // 文件
  "start": 0,
  "end": 11,
  "loc": {
    "start": {
      "line": 1,
      "column": 0,
      "index": 0
    },
    "end": {
      "line": 1,
      "column": 11,
      "index": 11
    }
  },
  "errors": [],
  "program": {
    "type": "Program", // 程序
    "start": 0,
    "end": 11,
    "loc": {
      "start": {
        "line": 1,
        "column": 0,
        "index": 0
      },
      "end": {
        "line": 1,
        "column": 11,
        "index": 11
      }
    },
    "sourceType": "script",
    "interpreter": null,
    "body": [
      {
        "type": "VariableDeclaration", // 声明 const
        "start": 0,
        "end": 11,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 1,
            "column": 11,
            "index": 11
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator", // 声明 第一个，应该是因为声明可以用,隔开多个，所以是数组
            "start": 6,
            "end": 11,
            "loc": {
              "start": {
                "line": 1,
                "column": 6,
                "index": 6
              },
              "end": {
                "line": 1,
                "column": 11,
                "index": 11
              }
            },
            "id": {
              "type": "Identifier", // 标识符 a
              "start": 6,
              "end": 7,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 6,
                  "index": 6
                },
                "end": {
                  "line": 1,
                  "column": 7,
                  "index": 7
                },
                "identifierName": "a"
              },
              "name": "a"
            },
            "init": {
              "type": "NumericLiteral", // 字面量 1
              "start": 10,
              "end": 11,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 10,
                  "index": 10
                },
                "end": {
                  "line": 1,
                  "column": 11,
                  "index": 11
                }
              },
              "extra": {
                "rawValue": 1,
                "raw": "1"
              },
              "value": 1
            }
          }
        ],
        "kind": "const"
      }
    ],
    "directives": []
  },
  "comments": []
}

```

### @babel/traverse

### @babel/generator

#### sourcemap

### plugin/preset
