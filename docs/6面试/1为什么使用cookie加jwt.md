# 为什么使用cookie加jwt

这个问题问到点子上了——👏
你已经抓到了“Cookie + Token” 和 “Cookie + Session” 的根本区别。
它们看起来都用 cookie，但**理念完全不同**。我们把底层机制讲透就明白为什么很多现代后端（比如 NestJS）即使用了 cookie，也还要用 token。

---

## 一、Cookie 是“容器”，不是“身份系统”

首先要分清两个概念：

- **Cookie**：只是浏览器自动附带的**小存储**，就像信封。
- **Session / Token**：才是信封里的**内容**，真正的身份凭证。

所以问题其实是：

> 「cookie 里装 session id」 vs 「cookie 里装 JWT token」

---

## 二、两种方式的工作原理对比

| 项目           | Cookie + Session                      | Cookie + JWT Token           |
| -------------- | ------------------------------------- | ---------------------------- |
| 存在服务端     | ✅ 有（session 保存在服务器或 Redis） | ❌ 无状态（token 自包含）    |
| 负载均衡支持   | 需要 sticky session（会话绑定）       | 任意节点可验证               |
| 服务端验证方式 | 查表：`sessionId → user`              | 校验签名：`verify(token)`    |
| 主动登出       | 容易：删掉 session                    | 麻烦：需要黑名单或短期 token |
| 可扩展性       | 一般                                  | 非常好（微服务友好）         |
| 安全性         | 高（可控）                            | 取决于 secret 管理和过期机制 |

---

## 三、各自的思想逻辑

### 1️⃣ Cookie + Session（传统 Web）

这是老牌的“有状态”认证。
流程如下：

1. 用户登录成功 → 服务器生成一个 session：

   ```js
   sessions["abc123"] = { userId: 1, role: "admin" };
   ```

2. 返回 cookie：

   ```
   Set-Cookie: sessionId=abc123; HttpOnly
   ```

3. 下次请求时浏览器自动带上这个 cookie；
4. 服务端查表验证身份。

特点：

- 一切状态存在服务器；
- 适合单体应用；
- 登出或过期直接删除 session；
- 但扩展到多台服务器就需要共享 session（Redis 或数据库）。

---

### 2️⃣ Cookie + JWT（现代 Web / 微服务）

JWT 是“无状态”的：

- 所有信息都在 token 里；
- 服务端不查表，只验证签名。

流程：

1. 用户登录 → 服务器签发：

   ```js
   const token = jwt.sign({ sub: user.id, role: "admin" }, secret);
   ```

2. 返回 cookie：

   ```
   Set-Cookie: token=eyJhbGciOi...; HttpOnly
   ```

3. 下次请求自动携带 cookie；
4. 服务端验证签名即可。

特点：

- 无需共享 session；
- 任何节点都能验证；
- 适合微服务和 API；
- 但登出难（token 不可撤销，只能等过期或维护黑名单）。

---

## 四、那为什么很多框架选择“Cookie + JWT”？

因为这是个“折中方案”：

- **用 cookie 管理 token**（HttpOnly、自动带上 → 防 XSS）；
- **用 JWT 实现无状态验证**（轻量、跨服务）。

典型用法：

- 浏览器登录后，后端返回：

  ```http
  Set-Cookie: access_token=JWT; HttpOnly; Secure; SameSite=Lax
  ```

- 接口验证时，NestJS 的 `JwtAuthGuard` 自动解析 cookie；
- 微服务、API、前端 SSR 都能用一套逻辑。

---

## 五、该选哪个？

| 场景                     | 推荐方案                        |
| ------------------------ | ------------------------------- |
| 单体网站（只有一个后端） | Cookie + Session（简单稳定）    |
| 前后端分离项目           | JWT（放 header 或 cookie 都行） |
| 微服务、多节点部署       | JWT（无状态）                   |
| 微信小程序、App          | JWT（header 带 token）          |

---

一句话总结：

> **Cookie 是传输手段；Session 和 JWT 是身份方案。**
> 如果你希望服务器“记住”状态 → 用 Session。
> 如果你希望服务器“无状态”伸缩 → 用 JWT。
> 如果你想两者兼得（安全又方便）→ Cookie 里装 JWT。

---

我可以帮你画一个三种模式的「时序图」（Session、JWT、Cookie+JWT），直观地看到数据在哪一端保存、如何验证、登出如何生效——要我画一张吗？
