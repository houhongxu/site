# CSR-SSR-SSG-ISR

大家可能听过 CSR、SSG、ISR、RSC 等渲染方式缩写，像报菜名一样多，很难完全记住。我一直认为，最好的记忆方式就是实现它，这次我们就一个个重新认识并实现他们。

> 由于最新的 RSC 的内容比较多，本次我们就先一起学习一下在其之前的渲染方式。

## CSR

CSR 全拼 Client Side Render，客户端渲染，大家都很熟悉。就是请求空白的 html，然后在客户端渲染，用 js 渲染来添加路由和页面。

- 优点是前后端分离，前端交互性强
- 缺点主要是 SEO 不友好、客户端 js 加载慢

所以适合交互复杂的页面如列表页等。

我们简单写个 demo：

先来一个 React render 函数：

```javascript
// client.js
import App from "./app";
import React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

root.render(<App />);
```

然后写个经典的 counter 组件：

```javascript
// app.js
import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${Math.floor(Math.random() * 100)}`)
      .then((res) => res.json())
      .then((user) => {
        setUser(user);
        setCount(user.age);
      });
  }, []);

  return (
    <>
      {user ? (
        <div>
          <h1>
            {user.username} Counters {count} times
          </h1>
          <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
```

里面有一个 count 状态，每次点击 count 会+1。里面额外加了一个 fetch 请求，它首次渲染随机会请求一个 user 数据，我们会展示这个 user 的名字，并用 user 的年龄初始化 count。这样就可以区分每次渲染了。

你也可以理解成，每次刷新随机抽一个人，点击一次这个人就变老一岁。

启动服务使用的 vercel 的 serve 包 `serve ./public -p 8000`，相当于启动了静态资源服务器来访问 html，端口是常用的 8000。

启动后我们请求 html 看一下，是经典的只有 div root 的 html，以及加载客户端入口 js 的 script：

```html
<html>
  <head>
    <title>CSR</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./client.entry.js"></script>
  </body>
</html>
```

但是，你会发现页面会因为请求闪一下，我们需要解决这个问题。CSR 的常规方法就是加 loading 状态嘛，但是也是属于闪一下的范畴。如果是首页，那还是影响用户体验。

回想一下，像基座一样用 SSR 在服务端渲染好页面是不是就解决了这个问题？一起来试一下。

## SSR

SSR 全拼 Server Side Render，服务端渲染。就是将 html 在服务端渲染完成后返回客户端。

- 优点是 SEO 友好、渲染加载快
- 缺点是需要额外服务器、客户端仍需要加载 js 水合

所以适合首页，或者我们基座这种需要尽快组合服务端数据的情况。

在 CSR 的基础上，起一个 express server：

```javascript
// server.js
import App from "./app";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const content = renderToString(<App />);

  res.send(`
    <html>
      <head>
        <title>SSR</title>
      </head>
      <body>
        <div id='root'>${content}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("listening on http://localhost:3000!"));
```

react-dom/server 提供的 renderToString api 会将组件渲染成字符串，我们把它直接放入 html 返回。

启动服务使用的就是 node 服务，就像接口一样，`node ./public/server.entry.js`。

启动后，看一下请求返回的 html，是已经包含内容的：

```html
<html>
  <head>
    <title>SSR</title>
  </head>
  <body>
    <div id="root">
      <div>
        <h1>
          Counters
          <!-- -->0<!-- -->
          times
        </h1>
        <button>Click me</button>
      </div>
    </div>
    <script src="./client.entry.js"></script>
  </body>
</html>
```

但是点击+1 会发现是没有任何反应的，因为服务端没有绑定事件的能力。我们要先解决绑定事件的问题，不然都不能用啊。

正好，对应 server，react-dom/client 有提供好的 api，hydrateRoot。这个过程一般叫做水合。

改一下 client.js，同时别忘了 server.js 要加一下客户端 js 加载：

```javascript
// client.js
import App from "./app";
import React from "react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document.getElementById("root"), <App />);
```

```javascript
// server.js 加载 html 模板里
<script src="./client.entry.js"></script>
```

成功了，完整的渲染出了。但是，还是会闪一下，因为请求还是在客户端发起的。

所以我们要再实现一下服务端请求。这里我们参考著名框架 NextJS 的 api，getServerSideProps。顾名思义在服务端请求数据后通过 props 传入。

我们改造一下：

```javascript
// app.js
import { useState } from "react";

export async function getServerSideProps() {
  const res = await fetch(
    `http://localhost:3001/api/users/${Math.floor(Math.random() * 100)}`
  );

  const user = await res.json();

  return { props: { user } };
}

export default function App({ user }) {
  const [count, setCount] = useState(user.age);

  return (
    <div>
      <h1>
        {user.username} Counters {count} times
      </h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

很直观啊，user 通过 props 传入了组件。那么就需要在 server.js 中引入然后执行，然后在 `<App/>` 中传入 props 即可。

这里我们抽出一个功能函数 getServerSideComponent 在 utils.js：

```javascript
import App, { getServerSideProps } from "./app";

export async function getServerSideComponent() {
  let props = {};

  if (getServerSideProps) {
    const result = await getServerSideProps();
    props = result.props;
  }

  return { Component: App, props };
}
```

最后更新一下 server.js：

```javascript
import App from "./app";
import { getServerSideComponent } from "./utils";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const { Component, props } = await getServerSideComponent();

  const content = renderToString(<Component {...props} />);

  res.send(`
    <html>
      <head>
        <title>SSR</title>
      </head>
      <body>
        <div id='root'>${content}</div>
        <script src="./client.entry.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("listening on http://localhost:3000!"));
```

启动看一下 html：

```html
<html>
  <head>
    <title>SSR</title>
  </head>
  <body>
    <div id="root">
      <div>
        <h1>
          Sarah Ross<!-- -->
          Counters
          <!-- -->26<!-- -->
          times
        </h1>
        <button>Click me</button>
      </div>
    </div>
    <script src="./client.entry.js"></script>
  </body>
</html>
```

内容成功返回了。但是，页面白屏报错了：

```
Uncaught TypeError: Cannot read properties of undefined (reading 'age') at App (app.js:50:72)
```

为什么？我们分析一下。这是客户端加载 js 报的错，这个 js 是水合阶段。具体错误是读 user.age 时 user 是 undefined，那就是没有传入 user。水合阶段确实没有发起客户端请求，所以就缺失了 user 数据。

那么在 app.js 里面保留 App 组件内的请求可行吗？注意我们的 fetch 请求是随机的，每次返回的 user 数据并不相同。所以这种实现还是会导致闪屏，是不可行的。

那只能将服务端请求的数据传入到客户端 js 中，这个阶段叫注入。通过 window 来实现：

```javascript
import App from "./app";
import { getServerSideComponent } from "./utils";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const { Component, props } = await getServerSideComponent();

  const content = renderToString(<Component {...props} />);

  res.send(`
    <html>
      <head>
        <title>SSR</title>
      </head>
      <body>
        <div id='root'>${content}</div>
        <script>
          window.__DATA__ = ${JSON.stringify({ props })}
        </script>
        <script src="./client.entry.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log("listening on http://localhost:3000!"));
```

然后在 client.js 里传入：

```javascript
// client.js
import App from "./app";
import React from "react";
import { hydrateRoot } from "react-dom/client";

const { props } = window.__DATA__;

hydrateRoot(document.getElementById("root"), <App {...props} />);
```

这样，我们的 SSR 渲染就基本实现了。

SSR 每次请求都会渲染一遍页面，如果我们页面很少更新呢，那 SSG 更合适一点。一次渲染，多次使用。

## SSG

SSG 全拼 Static Site Generation，静态网站生成。就是构建时将页面都渲染好输出成 html，客户端直接请求完整内容的 html。

- 优点是 SEO 友好、访问无需加载会很快
- 缺点是内容变更需重新部署、交互性差

所以适合展示类页面如详情页等。

SSG 与 SSR 都会渲染 html，主要的区别在于，SSR 是在接口请求时，而 SSG 是在构建时。所以我们基于 SSR 来修改代码。

首先将 getServerSideProps 替换为 getStaticProps，同时替换 getServerSideComponent 为 getStaticComponent：

```javascript
// app.js
import { useState } from "react";

export async function getStaticProps() {
  const res = await fetch(
    `http://localhost:3001/api/users/${Math.floor(Math.random() * 100)}`
  );

  const user = await res.json();

  return { props: { user } };
}

export default function App({ user }) {
  const [count, setCount] = useState(user.age);

  return (
    <div>
      <h1>
        {user.username} Counters {count} times
      </h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

```javascript
// utils.js
import App, { getStaticProps } from "./app";

export async function getStaticComponent() {
  let props = {};

  if (getStaticProps) {
    const result = await getStaticProps();
    props = result.props;
  }

  return { Component: App, props };
}
```

客户端代码不需要变动，服务端代码需要将 express 接口改为生成 html 的代码：

```javascript
import { getStaticComponent } from "./utils";
import fs from "fs";
import { renderToString } from "react-dom/server";

const { Component, props } = await getStaticComponent();

const content = renderToString(<Component {...props} />);

fs.writeFileSync(
  "./public/index.html",
  `
    <html>
      <head>
        <title>SSG</title>
      </head>
      <body>
        <div id='root'>${content}</div>
        <script>
          window.__DATA__ = ${JSON.stringify({ props })}
        </script>
        <script src="./client.entry.js"></script>
      </body>
    </html>
  `
);
```

build 时需要执行服务端代码 `webpack --config webpack.server.js && webpack --config webpack.client.js && node ./public/server.entry.js`。

访问的时候直接访问 html 文件即可，甚至不需要前端路由。

## ISR

ISR 全拼 Incremental Static Regeneration，增量静态生成。就是在 SSG 的基础上，在用户请求后自动重新构建该页面最新的 html。

- 优点除了包括 SSG 所有优点，额外支持自动构建页面
- 缺点还是交互性差

所以适合附带数据的展示类页面如带有点赞数的文章页。

ISR 相比 SSG 又多出来一个 express 服务，并带有一个重新构建逻辑。

你可以通过 getStaticProps 函数额外返回 revalidate 参数来控制重新构建的时间。比如 revalidate=3 时，从 0s 访问到 1s、2s、3s 的访问都是访问旧的 html，但是 3s 后访问，就会触发页面重新构建。假设构建时间 0.5s，那么 4s 时去访问时就是新的 html 了。

我们基于 SSG 的基础修改。首先给 app.js 加上 revalidate 这个参数，别忘了 utils.js 也同步：

```javascript
// app.js
import { useState } from "react";

export async function getStaticProps() {
  const res = await fetch(
    `http://localhost:3001/api/users/${Math.floor(Math.random() * 100)}`
  );

  const user = await res.json();

  return {
    props: { user },
    revalidate: 3,
  };
}

export default function App({ user }) {
  const [count, setCount] = useState(user.age);

  return (
    <div>
      <h1>
        {user.username} Counters {count} times
      </h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

```javascript
// utils.js
import App, { getStaticProps } from "./app";

export async function getStaticComponent() {
  let props = {};
  let revalidate = 0;

  if (getStaticProps) {
    const result = await getStaticProps();
    props = result.props;
    revalidate = result.revalidate;
  }

  return { Component: App, props, revalidate };
}
```

因为会重复构建，所以我们需要复用 SSG 的服务端代码，抽成一个单独的函数 build 到单独文件里：

```javascript
// build.js
import { INDEX_PATH } from "./constants";
import { HTML_DIR_PATH } from "./constants";
import { getStaticComponent } from "./utils";
import fs from "fs";
import { renderToString } from "react-dom/server";

export let currentRevalidate;

export async function build() {
  if (!fs.existsSync(HTML_DIR_PATH)) {
    fs.mkdirSync(HTML_DIR_PATH);
  }

  const { Component, props, revalidate } = await getStaticComponent();

  currentRevalidate = revalidate;

  const content = renderToString(<Component {...props} />);

  fs.writeFileSync(
    INDEX_PATH,
    `
      <html>
        <head>
          <title>ISR</title>
        </head>
        <body>
          <div id='root'>${content}</div>
          <script>
            window.__DATA__ = ${JSON.stringify({ props })}
          </script>
          <script src="./client.entry.js"></script>
        </body>
      </html>
    `
  );
}
```

同时为了实时获取到页面 revalidate，我们将它保存在内存中然后导出，叫 currentRevalidate，每次渲染页面调用 getStaticComponent 时都会更新。

因为复用了路径参数，所以单独抽成了 constants 文件：

```javascript
// constants.js
import path from "path";

export const SERVER_ROOT_PATH = __dirname;
export const HTML_DIR_PATH = path.join(SERVER_ROOT_PATH, "html");
export const INDEX_PATH = path.join(HTML_DIR_PATH, "index.html");
```

最后，我们再起一个 express 服务：

```javascript
import { build, currentRevalidate } from "./build";
import { INDEX_PATH } from "./constants";
import express from "express";
import fs from "fs";

let loading = false;

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log(req.path);

  fs.stat(INDEX_PATH, async (err, stats) => {
    if (err) {
      console.log("模拟构建");
      await build();
    } else {
      const isExpired =
        typeof currentRevalidate === "number" &&
        Date.now() - stats.mtimeMs > currentRevalidate * 1000;

      if (isExpired && !loading) {
        loading = true;
        console.log(isExpired ? "重新生成html" : "尚未过期");
        build().finally(() => {
          loading = false;
        });
      }
    }

    return res.sendFile(INDEX_PATH);
  });
});

app.listen(3000, () => console.log("listening on http://localhost:3000!"));
```

我们首先维护一个加载中状态 loading，在 build loading 时不重复触发 build。然后使用 fs.stat 读取到文件生成时间，使用 currentRevalidate 获取到过期时间，通过 now-文件生成时间>过期时间即可算出是否过期状态 isExpired。

现在就可以写出逻辑了，如果过期且不在加载，则触发重新 build。每次请求使用 express 的 sendFile 返回生成好的 html 即可。另外补充一下 err 时的兜底逻辑。

ISR 也被我们实现了。

## CSR-SSR-SSG-ISR

研究了这几种渲染方式，可以发现他们适合的页面各不相同。那么有没有方法将他们一起使用，在不同页面分别发挥他们的优点呢？有的兄弟有的。

从 NextJS API 的设计语言上来看，本身就是这样区分的：

一个没有请求的页面，默认使用 SSG 生成 html，会有最快的访问速度，也可以加上服务端请求 getStaticProps [SSG]。如果你页面中新增使用了 useEffect 请求接口，那么不影响 html 的生成，同时也会拥有 CSR 的灵活性 [SSG,CSR]。你还可以在同时开启 SSG 的增强功能自动更新 html [ISR,CSR]。同时你也可以改为选择使用服务端请求 getServerSideProps 来使用 SSR [SSR,CSR]。

记住，getServerSideProps 与 getStaticProps 无法同时生效。

既然有这么多情况，我们将他们分离为一个个页面，那么我们首先需要实现一下文件路由。新建 page 文件夹，分别新建 csr.js、ssr.js、ssg.js、isr.js 和 ssr-csr.js、ssg-csr.js、isr-csr.js，每一个文件都会对应一个页面路由。具体代码就不举例了，参考上面即可。

首先关注客户端代码，之前都是直接从 app.js 静态 import 组件。现在却是很多 js 文件，我们需要使用动态 import 分别导入它们。导入路径也是动态的 `./pages/${path}.js`，那么具体传入 path 的 page 参数怎么获取呢，就需要从 window.**DATA** 中注入了：

```javascript
// client.js
import React from "react";
import { hydrateRoot } from "react-dom/client";

const { props, page } = window.__DATA__;

const importFile = async (path) => {
  return await import(`./pages/${path}.js`);
};

const { default: Component } = await importFile(page);

hydrateRoot(document.getElementById("root"), <Component {...props} />);
```

同理，getStaticComponent 和 getServerSideComponent 返回的组件也不能静态 import 了，我们顺便合二为一叫 getPropsAndComponent。返回的 html 渲染过程我们也顺便抽成一个函数 getHtml 来动态传入标题：

```javascript
// utils.js
import { renderToString } from "react-dom/server";

export async function getPropsAndComponent(page) {
  const files = await import(`./pages/${page}.js`);

  const { getServerSideProps, getStaticProps, default: Component } = files;

  let props = {};
  let revalidate = 0;
  let ssr = false;

  if (getStaticProps) {
    const result = await getStaticProps();
    props = result.props;
    revalidate = result.revalidate;
  } else if (getServerSideProps) {
    const result = await getServerSideProps();
    props = result.props;
    ssr = true;
  }

  return { Component, props, revalidate, ssr };
}

export async function getHtml(page, Component, props) {
  const content = renderToString(<Component {...props} />);

  const html = `
    <html>
      <head>
        <title>${page}</title>
      </head>
      <body>
        <div id='root'>${content}</div>
        <script>
          window.__DATA__ = ${JSON.stringify({ props, page })}
        </script>
        <script src="./client.entry.js"></script>
      </body>
    </html>
  `;

  return html;
}
```

你会发现 getPropsAndComponent 里面多了一个 ssr 状态，它是用来区别是否启用的是 SSR。

我们会在 server.js 里将客户端请求路径解析为 page 参数传入。这里逻辑看起来复杂了一点，但都是之前逻辑的组合，如果之前的理解了，就很简单：

```javascript
// server.js
import { revalidateMap, build } from "./build";
import { PAGE_DIR_PATH, HTML_DIR_PATH } from "./constants";
import { getPropsAndComponent } from "./utils";
import { getHtml } from "./utils";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.static("public"));

let loading = false;

app.get(/.*/, async (req, res) => {
  const reqPath = req.path.split("/")[1];
  const page = reqPath ? reqPath : "index";

  const pages = fs.readdirSync(PAGE_DIR_PATH).map((file) => file.split(".")[0]);

  if (!pages.includes(page)) {
    res.status(200).send(`404 Not Found ${req.path}`);
    return;
  }

  const { Component, props, revalidate, ssr } = await getPropsAndComponent(
    page,
    req,
    res
  );

  const html = await getHtml(page, Component, props);

  if (ssr) {
    res.send(html);
  } else {
    const htmlPath = path.join(HTML_DIR_PATH, `${page}.html`);

    revalidateMap[page] = revalidate;

    fs.stat(htmlPath, async (err, stats) => {
      if (err) {
        await build(page, html);
      } else {
        const isExpired =
          typeof revalidateMap[page] === "number" &&
          Date.now() - stats.mtimeMs > revalidateMap[page] * 1000;

        if (isExpired && !loading) {
          loading = true;
          build(page, html).finally(() => {
            loading = false;
          });
        }
      }

      return res.sendFile(htmlPath);
    });
  }
});

app.listen(3000, () => console.log("listening on http://localhost:3000!"));
```

首先从客户端请求路径拿到 page 参数，然后用 fs 从文件系统读取已有页面的路径 pages，进行页面是否存在的判断。然后就是和之前一样，通过 getPropsAndComponent，获取到组件 Component 和 props，revalidate 和 ssr 状态，另外通过 getHtml 获取到渲染好的 html。

如果是 SSR，那么我们可以直接服务端渲染好的返回 html。如果不是，那么就按 ISR 逻辑来执行 build。

由于之前渲染好了 html，build 逻辑简单了很多，顺便一起补充好 constant.js：

```javascript
// build.js
import { HTML_DIR_PATH } from "./constants";
import fs from "fs";
import path from "path";

export const revalidateMap = {};

export async function build(page, html) {
  if (!fs.existsSync(HTML_DIR_PATH)) {
    fs.mkdirSync(HTML_DIR_PATH);
  }

  fs.writeFileSync(path.join(HTML_DIR_PATH, `${page}.html`), html);
}
```

```javascript
// constants.js
import path from "path";

export const SERVER_ROOT_PATH = __dirname;
export const HTML_DIR_PATH = path.join(SERVER_ROOT_PATH, "html");
const ROOT_PATH = path.join(__dirname, "..");
export const PAGE_DIR_PATH = path.join(ROOT_PATH, "pages");
```

因为现在有很多页面，所以 currentValidate 被替换为了 revalidateMap，通过 page 参数区分不同页面的 revalidate。

到这里，一个完整的支持 CSR-SSR-SSG-ISR 渲染的简单服务就实现了。这样是不是记忆更深刻了一点？
