# create 的实现原理

`yarn create react-app my-app`
相当于

```js
yarn global add create-react-app
create-react-app my-app
```

所以，我们发布名为 create-koa-cli 的包，并配置

```js
"bin":{
  "create-koa-cli":"..."
}
```

就会在执行`yarn create koa-cli`时执行

```js
yarn global add create-koa-cli
create-koa-cli
```

这样就可以通过`create-koa-cli`指令来控制项目文件的创建

## break change

大版本变化导致上一个版本不能适配下一个版本
