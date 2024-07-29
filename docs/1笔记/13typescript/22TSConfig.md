# TSConfig

## 构建相关

### 构建之前的源码相关

#### 特殊语法相关

##### decorator

- experimentalDecorators 实验性装饰器：启用装饰器的 @ 语法
- emitDecoratorMetadata 发送装饰器元数据：装饰器实际运行时的元数据相关逻辑

##### jsx

- jsx
- jsxFactory
- jsxFragmentFactory
- jsxImportSource

jsx 选项：

- react：将 JSX 组件转换为对 React.createElement 调用，生成 .js 文件
- preserve（原样保留 JSX 组件，生成 .jsx 文件，你可以接着让其他的编译器进行处理）
- react-native （类似于 preserve，但会生成 .js 文件）
- react-jsx 与 react-jsxdev JSX 组件会被转换为对 \_\_jsx 方法的调用与生成 .js 文件，此方法来自于 react/jsx-runtime

##### target

target 配置决定了你的构建代码使用的语法，常用值包括 es5、es6、es2018、es2021、esnext（基于目前的 TypeScript 版本所支持的最新版本） 等等

更改 target 配置也会同时影响你的 lib 配置默认值，而它决定了你是否能使用某些来自于更新版本的 ECMAScript 语法

除了高版本语法以外，lib 其实也和你的实际运行环境有关。比如，当你的代码仅在 Node 环境下运行时，你的 lib 中不应当包含 "DOM" 这个值。对应的，代码中无法使用 window 、document 等全局变量

#### 构建解析相关

##### file

- files：包含的所有文件，不支持 glob pattern
- include：批量包括文件，例如 `src/**/*` 表示匹配 src 下所有的合法文件
- exclude：批量排除文件，**只能剔除已经被 include 包含的文件**

##### rootDir

项目文件的根目录，默认情况下它是项目内包括的所有 .ts 文件的最长公共路径

```text
PROJECT
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── utils
│   │   ├── helpers.ts
├── declare.d.ts
├── tsconfig.json
```

如上是推断为 src

rootDir 包含的文件才会被生成在 outDir(/dist) 内

rootDirs 用于实现多个虚拟目录的合并解析

##### baseUrl 与 paths

定义文件进行解析的根目录，它通常会是一个相对路径，然后配合 tsconfig.json 所在的路径来确定根目录的位置

可以通过这一配置，在导入语句中使用相对 baseUrl 的解析路径
`import "src/core";`

paths 类似于 Webpack 中的 alias，允许你通过 @/utils 或类似的方式来简化导入路径

进行相当于 bashUrl 的声明映射

paths 的解析是基于 baseUrl 作为相对路径的，因此需要确保指定了 baseUrl

但是打包时不会帮助解析？需要插件

##### types

默认情况下，TypeScript 会加载 node_modules/@types/ 下的所有声明文件，包括嵌套的 ../../node_modules/@types 路径

可以只加载实际使用的类型定义包

`"types": ["node", "jest", "react"]`

typeRoots 选项，其默认为 @types，可以更改加载路径

`"typeRoots": ["./node_modules/@types", "./node_modules/@team-types", "./typings"]`

##### moduleResolution

指定了模块的解析策略，可以配置为 node（默认） 或者 classic，classic 主要作向后兼容用，基本不推荐使用

##### resolveJsonModule

可以直接导入 Json 文件，并对导入内容获得完整的基于实际 Json 内容的类型推导

### 构建产物相关

#### 构建输出相关

##### module

最终 JavaScript 产物使用的模块标准，常见的包括 CommonJs、ES6、ESNext 以及 NodeNext 等（实际的值也可以是全小写的形式）。另外也支持 AMD、UMD、System 等模块标准

##### outDir 与 outFile

outDir 配置的值将包括所有的构建产物，通常情况下会按照原本的目录结构存放

outFile 类似于 Rollup 或 ESBuild 中的 bundle 选项，它会将所有的产物（其中非模块的文件）打包为单个文件，但仅能在 module 选项为 None / System / AMD 时使用

##### noEmit

noEmit 开启时将不会写入文件系统中，即只进行类型检查

### 声明文件相关

### Source Map 相关

## 检查相关

## 工程相关

## JavaScript 相关
