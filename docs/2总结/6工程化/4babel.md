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

对了，@babel/parser 本身就是重度参考 acorn，fork 并改造的 babylon

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
        "type": "VariableDeclaration", // 声明 const a=1
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
            "type": "VariableDeclarator", // 声明 第一个 a=1，应该是因为声明可以用,隔开多个，所以是数组
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

像用上面的例子的 ast，遍历节点顺序就是如下

其中 enter 和 exit 就是进入 Node 时和退出 Node 时

path 可以访问当前 Node，父 Node 等属性，链接了整个路径，也可以修改 Node

state 可以传递参数

```js
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const jsCodeString = "const a = 1";

const babelAst = parse(jsCodeString, { tokens: true });

traverse(
  babelAst,
  {
    enter(path, state) {
      console.log("enter", path.node.type, state);
      state.count++;
    },
    exit(path, state) {
      console.log("exit", path.node.type, state);
    },
    "Identifier|NumericLiteral"(path) {
      console.log("Identifier|NumericLiteral", path.node.type);
    },
  },
  undefined,
  { count: 1 }
);


enter Program
enter VariableDeclaration
enter VariableDeclarator
enter Identifier
Identifier|NumericLiteral Identifier
exit Identifier
enter NumericLiteral
Identifier|NumericLiteral NumericLiteral
exit NumericLiteral
exit VariableDeclarator
exit VariableDeclaration
exit Program
```

### @babel/generator

最后将处理完的 ast 转成 code，顺带生成 sourcemap

sourcemap 就是可以将错误定位到源码的文件

```
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

const jsCodeString = "const a = 1";

const babelAst = parse(jsCodeString, { tokens: true });

traverse(babelAst, {
  NumericLiteral(path) {
    path.node.value = 2;
  },
});

const result = generate(babelAst, { sourceMaps: true });

console.log(result.code, result.map);

const a = 2; {
  version: 3, // sourcemap版本
  file: undefined, // 转换后文件名
  names: [ 'a' ], // 转换前的所有变量
  sourceRoot: undefined, // 转换前的文件目录
  sources: [ 'a.js' ], // 转换前的文件名
  sourcesContent: [ null ],
  mappings: 'AAAA,MAAMA,CAAC,GAAG,CAAC', //  VLQ 编码映射行列
  ignoreList: []
}
```

### plugin/preset

插件

babel 插件有两种格式，直接是配置对象或者是一个返回配置对象的函数都可以

我们就用函数来写一个去除 console.log 的插件

因为函数的参数比较方便，第一个参数 api 就是@babel/core 的默认导出，第二个参数就是用户参数，第三个就是执行路径

如果要 ts 类型的话，需要使用@babel/helper-plugin-utils 这个包

如果想接受用户参数，可以通过插件第二个参数，也可以插件内可以用 state.opts 读取到

preset 更简单了，就是一个带有 plugins 属性的对象，用于官方集合多个插件减少用户配置复杂度

```js
import { PluginItem, transform } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";

const BabelPluginLog = declare((api, options, dirname) => {
  console.log(Object.keys(api), options, dirname);

  return {
    name: "remove-console",
    pre(state) {},
    visitor: {
      CallExpression(path, state) {
        const callee = path.node.callee;

        console.log(state.opts);

        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "Identifier" &&
          callee.object.name === "console" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "log"
        ) {
          path.remove();
        }
      },
    },
    post(state) {},
  };
});

type Params = Parameters<ReturnType<typeof declare>>;

const BabelPresetsLog: (...args: Params) => { plugins: PluginItem[] } = (
  api,
  options,
  dirname
) => ({
  plugins: [[BabelPluginLog, options?.logOptions]],
});

const jsCodeString = "const a = 1;console.log(1)";

const result = transform(jsCodeString, {
  presets: [[BabelPresetsLog, { logOptions: { option1: true } }]],
  // plugins: [[BabelPluginLog, { option1: true }]],
});

console.log(result?.code);


[
  'DEFAULT_EXTENSIONS',    'File',
  'buildExternalHelpers',  'createConfigItem',
  'createConfigItemAsync', 'createConfigItemSync',
  'getEnv',                'loadOptions',
  'loadOptionsAsync',      'loadOptionsSync',
  'loadPartialConfig',     'loadPartialConfigAsync',
  'loadPartialConfigSync', 'parse',
  'parseAsync',            'parseSync',
  'resolvePlugin',         'resolvePreset',
  'template',              'tokTypes',
  'transform',             'transformAsync',
  'transformFile',         'transformFileAsync',
  'transformFileSync',     'transformFromAst',
  'transformFromAstAsync', 'transformFromAstSync',
  'transformSync',         'traverse',
  'types',                 'version',
  'OptionManager',         'Plugin',
  'cache',                 'env',
  'async',                 'caller',
  'assertVersion',         'targets',
  'addExternalDependency', 'assumption'
] { option1: true } /Users/houhongxu/workspace/hhx/book/babel
{ option1: true }
const a = 1;
```

## 源码简读

### @babel/parser

先看包的具名导出函数 parse

unambiguous 情况先不看

通过 getParser 获取 parser 实例然后执行 parse 函数

```js
export function parse(input: string, options?: Options): File {
  //// unambiguous情况先不看
  if (options?.sourceType === "unambiguous") {
  } else {
    //// 通过getParser获取parser实例然后执行parse函数
    return getParser(options, input).parse();
  }
}
```

getParser 函数就是获取 Parser 类实例

先指定默认类

然后根据插件获取一个新的含插件的类

最后返回 new 这个类的实例

```js
function getParser(options: Options | undefined | null, input: string): Parser {
  //// 获取默认的Parser类
  let cls = Parser;

  const pluginsMap: PluginsMap = new Map();

  //// 如果有插件，插件处理后获取新的Parser类
  if (options?.plugins) {
    for (const plugin of options.plugins) {
      let name, opts;
      if (typeof plugin === "string") {
        name = plugin;
      } else {
        [name, opts] = plugin;
      }
      if (!pluginsMap.has(name)) {
        pluginsMap.set(name, opts || {});
      }
    }
    validatePlugins(pluginsMap);
    cls = getParserClass(pluginsMap);
  }

  //// 返回Parser类实例
  return new cls(options, input, pluginsMap);
}
```

Parser 实例比较复杂，extends 链路比较长

Parser->StatementParser->ExpressionParser->LValParser->NodeUtils->UtilParser->Tokenizer->CommentsParser->BaseParser

我们主要看 nextToken 和 parseTopLevel

即对应了词法分析和语法分析阶段

```js

//// 继承链路Parser->StatementParser->ExpressionParser->LValParser->NodeUtils->UtilParser->Tokenizer->CommentsParser->BaseParser
export default class Parser extends StatementParser {
  // Forward-declaration so typescript plugin can override jsx plugin
  // todo(flow->ts) - this probably can be removed
  // abstract jsxParseOpeningElementAfterName(
  //   node: N.JSXOpeningElement,
  // ): N.JSXOpeningElement;

  constructor(
    options: Options | undefined | null,
    input: string,
    pluginsMap: PluginsMap,
  ) {
    options = getOptions(options);
    super(options, input);

    this.options = options;
    this.initializeScopes();
    this.plugins = pluginsMap;
    this.filename = options.sourceFilename;
  }

  // This can be overwritten, for example, by the TypeScript plugin.
  getScopeHandler(): new (...args: any) => ScopeHandler {
    return ScopeHandler;
  }

  //// 核心的parse函数
  parse(): N.File {
    //// UtilParser 进入初始上下文
    this.enterInitialScopes();

    //// NodeUtils 新建结果对象
    const file = this.startNode<N.File>();

    //// NodeUtils 新建程序节点对象
    const program = this.startNode<N.Program>();

    //// Tokenizer 获取当前token并处理下一个token js->token
    this.nextToken();

    file.errors = null;

    //// StatementParser 从最外层开始解析ast token->ast
    this.parseTopLevel(file, program);

    file.errors = this.state.errors;

    file.comments.length = this.state.commentsLen;

    //// 返回结果对象
    return file as N.File;
  }
}

```

词法分析

主要就是通过 getTokenFromCode 来将 jscode 解析为 token

getTokenFromCode 就是通过 switch 来根据字符的 unicode 即 charCode 来创建 token

```js

export default abstract class Tokenizer extends CommentsParser {
  // ...

  // Read a single token, updating the parser object's token-related properties.
  nextToken(): void {
    this.skipSpace();

    this.state.start = this.state.pos;

    if (!this.isLookahead) this.state.startLoc = this.state.curPosition();

    //// 读取的位置到最后则结束token解析
    if (this.state.pos >= this.length) {
      this.finishToken(tt.eof);
      return;
    }

    //// 从jscode解析token
    this.getTokenFromCode(this.codePointAtPos(this.state.pos));
  }


  //// jscode->token
  getTokenFromCode(code: number): void {
    /// 通过switch来根据字符的unicode即charCode来创建token
    switch (code) {
      // The interpretation of a dot depends on whether it is followed
      // by a digit or another two dots.

      case charCodes.dot:
        this.readToken_dot();
        return;
      // Punctuation tokens.
      case charCodes.leftParenthesis:
        ++this.state.pos;
        this.finishToken(tt.parenL);
        return;

      // ...

      default:
      if (isIdentifierStart(code)) {
        this.readWord(code);
        return;
      }
    }
  }


  //// 创建dot的token
  readToken_dot(): void {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next >= charCodes.digit0 && next <= charCodes.digit9) {
      this.readNumber(true);
      return;
    }

    if (
      next === charCodes.dot &&
      this.input.charCodeAt(this.state.pos + 2) === charCodes.dot
    ) {
      this.state.pos += 3;
      this.finishToken(tt.ellipsis);
    } else {
      ++this.state.pos;
      this.finishToken(tt.dot);
    }
  }

}

//// token映射
export const tt = {
  // ...

  dot: createToken("."),

  // ...
}
```

语法分析

parseTopLevel 先解析最外层来给返回结果 file 对象赋值

主要属性是 program，所以先只看 parseProgram

然后 parseProgram 解析 program 的 ast 对象，主要属性是 body 数组

parseBlockBody 初始化 body 数组

parseBlockOrModuleBlockBody 循环解析每一部分代码为 ast 并压入 body 数组

解析 ast 主要看 parseStatementListItem 中的 parseStatementLike 中的 parseStatementContent

是根据 token 的 type 进行 switch，来生成对应的 ast 对象

和生成 token 时相似

```js

export default abstract class StatementParser extends ExpressionParser {
  // ### Statement parsing

  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.

  //// 解析最外层
  parseTopLevel(
    this: Parser,
    file: Undone<N.File>,
    program: Undone<N.Program>,
  ): N.File {
    //// 解析program对象到结果中
    file.program = this.parseProgram(program);

    //// 解析注释对象到结果中
    file.comments = this.comments;

    //// 添加tokens数组到结果中
    if (this.options.tokens) {
      file.tokens = babel7CompatTokens(this.tokens, this.input);
    }

    return this.finishNode(file, "File");
  }


  //// 解析program ast 对象
  parseProgram(
    this: Parser,
    program: Undone<N.Program>,
    end: TokenType = tt.eof,
    sourceType: SourceType = this.options.sourceType,
  ): N.Program {
    program.sourceType = sourceType;

    program.interpreter = this.parseInterpreterDirective();

    //// 解析body对象
    this.parseBlockBody(program, true, true, end);

    // ...

    return finishedProgram;
  }


  //// 解析body对象
  parseBlockBody(
    this: Parser,
    node: Undone<N.BlockStatementLike>,
    allowDirectives: boolean | undefined | null,
    topLevel: boolean,
    end: TokenType,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): void {
    //// body 数组，每部分代码都是其中的item
    const body: N.BlockStatementLike["body"] = (node.body = []);

    const directives: N.BlockStatementLike["directives"] = (node.directives =
      []);

    //// 解析代码为ast并压入body数组
    this.parseBlockOrModuleBlockBody(
      body,
      allowDirectives ? directives : undefined,
      topLevel,
      end,
      afterBlockParse,
    );
  }

  //// 解析代码为ast并压入body数组
  // Undefined directives means that directives are not allowed.
  // https://tc39.es/ecma262/#prod-Block
  // https://tc39.es/ecma262/#prod-ModuleBody
  parseBlockOrModuleBlockBody(
    this: Parser,
    body: N.Statement[],
    directives: N.Directive[] | undefined | null,
    topLevel: boolean,
    end: TokenType,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): void {
    const oldStrict = this.state.strict;
    let hasStrictModeDirective = false;
    let parsedNonDirective = false;

    //// 循环解析每一部分代码
    while (!this.match(end)) {
      //// 根据是否在顶层区分解析函数
      const stmt = topLevel
        ? this.parseModuleItem()
        : this.parseStatementListItem();

      if (directives && !parsedNonDirective) {
        if (this.isValidDirective(stmt)) {
          const directive = this.stmtToDirective(stmt);
          directives.push(directive);

          if (
            !hasStrictModeDirective &&
            directive.value.value === "use strict"
          ) {
            hasStrictModeDirective = true;
            this.setStrict(true);
          }

          continue;
        }
        parsedNonDirective = true;
        // clear strict errors since the strict mode will not change within the block
        this.state.strictErrors.clear();
      }

      //// 将解析的ast push到body数组
      body.push(stmt);
    }

    afterBlockParse?.call(this, hasStrictModeDirective);

    if (!oldStrict) {
      this.setStrict(false);
    }

    this.next();
  }


  //// 代码块内解析函数
  // https://tc39.es/ecma262/#prod-StatementListItem
  parseStatementListItem(this: Parser) {
    return this.parseStatementLike(
      ParseStatementFlag.AllowDeclaration |
        ParseStatementFlag.AllowFunctionDeclaration |
        (!this.options.annexB || this.state.strict
          ? 0
          : ParseStatementFlag.AllowLabeledFunction),
    );
  }


  //// 代码块内解析函数
  // ImportDeclaration and ExportDeclaration are also handled here so we can throw recoverable errors
  // when they are not at the top level
  parseStatementLike(
    this: Parser,
    flags: ParseStatementFlag,
  ):
    | N.Statement
    | N.Declaration
    | N.ImportDeclaration
    | N.ExportDefaultDeclaration
    | N.ExportNamedDeclaration
    | N.ExportAllDeclaration {
    let decorators: N.Decorator[] | null = null;

    if (this.match(tt.at)) {
      decorators = this.parseDecorators(true);
    }

    //// 返回解析的ast
    return this.parseStatementContent(flags, decorators);
  }


  //// 根据token解析ast
  parseStatementContent(
    this: Parser,
    flags: ParseStatementFlag,
    decorators?: N.Decorator[] | null,
  ): N.Statement {
    //// type就是token里的type
    const startType = this.state.type;
    const node = this.startNode();
    const allowDeclaration = !!(flags & ParseStatementFlag.AllowDeclaration);
    const allowFunctionDeclaration = !!(
      flags & ParseStatementFlag.AllowFunctionDeclaration
    );
    const topLevel = flags & ParseStatementFlag.AllowImportExport;

    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.

    //// 通过switch token的type来生成ast
    switch (startType) {
      case tt._break:
        return this.parseBreakContinueStatement(node, /* isBreak */ true);
      case tt._continue:
        return this.parseBreakContinueStatement(node, /* isBreak */ false);

      // ...

      default: {
        if (this.isAsyncFunction()) {
          if (!allowDeclaration) {
            this.raise(
              Errors.AsyncFunctionInSingleStatementContext,
              this.state.startLoc,
            );
          }
          this.next(); // eat 'async'
          return this.parseFunctionStatement(
            node as Undone<N.FunctionDeclaration>,
            true,
            !allowDeclaration && allowFunctionDeclaration,
          );
        }
      }
    }
  }
}
```

### @babel/generator

先看包默认导出的函数 generate

就是将格式化并赋予默认值的参数传给内部的 Printer 实例

Printer 实例的 generate 会将 ast 转 code

其中 map 实例也参与处理来生成 sourcemap

```js
//// 包导出的generate函数
/**
 * Turns an AST into code, maintaining sourcemaps, user preferences, and valid output.
 * @param ast - the abstract syntax tree from which to generate output code.
 * @param opts - used for specifying options for code generation.
 * @param code - the original source code, used for source maps.
 * @returns - an object containing the output code and source map.
 */
export default function generate(
  ast: t.Node,
  opts: GeneratorOptions = {},
  code?: string | { [filename: string]: string }
): GeneratorResult {
  //// 格式化options
  const format = normalizeOptions(code, opts);

  //// 构建sourcemap
  const map = opts.sourceMaps ? new SourceMap(opts, code) : null;

  //// 构建Printer实例
  const printer = new Printer(format, map);

  //// 生成code
  return printer.generate(ast);
}
```

Priter 类

属性`_buf` 是 babel 自定义的 Buffer 实例，处理后的字符暂时存在其中

generate 会先调用 this.print 来逐字打印字符，存入`_buf`

然后返回`_buf` 处理后的结果对象

print 函数会根据 ast node 的 type 属性获取 printMethod，每个 printMethod 对应一个函数

如 WhileStatement 就有同名函数，可以看出是逐字打印的

最后会在 exactSource 中执行

exactSource 是 babel 实现的更精确的 sourcemap 处理函数

逻辑都是处理 sourcemap 的，反正最后都是调用 printMethod 函数

```js
class Printer {
  constructor(format: Format, map: SourceMap) {
    this._buf = new Buffer(map, format.indent.style[0]);
  }

  //...

  //// generate函数生成新code
  generate(ast: t.Node) {
    //// 逐字打印
    this.print(ast);

    this._maybeAddAuxComment();

    //// 返回buffer处理的结果，包括新code
    return this._buf.get();
  }


  print(
    node: t.Node | null,
    parent?: t.Node,
    noLineTerminatorAfter?: boolean,
    trailingCommentsLineOffset?: number,
    forceParens?: boolean,
  ) {
    if (!node) return;

    //// 节点类型
    const nodeType = node.type;

    //// 根据节点类型获取打印方法，在最下方已经挂载过方法，本函数执行时肯定可以访问到
    const printMethod =
      this[
        nodeType as Exclude<
          t.Node["type"],
          // removed
          | "Noop"
          // renamed
          | t.DeprecatedAliases["type"]
        >
      ];

    if (printMethod === undefined) {
      throw new ReferenceError(
        `unknown node of type ${JSON.stringify(
          nodeType,
        )} with constructor ${JSON.stringify(node.constructor.name)}`,
      );
    }

    const loc = nodeType === "Program" || nodeType === "File" ? null : node.loc;

    //// 处理sourcemap
    this.exactSource(
      loc,
      // We must use @ts-ignore because this error appears in VSCode but not
      // when doing a full build?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/58468
      printMethod.bind(this, node, parent),
    );
  }

  exactSource(loc: Loc | undefined, cb: () => void) {
    //// 没有loc不需要处理sourcemap，直接调用printMethod返回
    if (!loc) {
      cb();
      return;
    }

    this._catchUp("start", loc);

    //// 处理sourcemap后调用printMethod返回
    this._buf.exactSource(loc, cb);
  }

  //...
}

// WhileStatement函数
export function WhileStatement(this: Printer, node: t.WhileStatement) {
  this.word("while");
  this.space();
  this.token("(");
  this.print(node.test, node);
  this.token(")");
  this.printBlock(node);
}


```

### @babel/core

### 官方 preset
