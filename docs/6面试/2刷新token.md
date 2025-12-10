# 刷新token

很棒，这个问题说明你已经从“能登录”走向“能稳定、安全地维持登录”。

接下来我们把整个 **Access Token / Refresh Token** 的刷新机制讲透。

---

## 一、为什么要有两个 token？

因为这两个 token 是在安全性与便利性之间做的平衡：

| 名称              | 有效期                 | 用途                         | 存放位置                   | 风险       |
| ----------------- | ---------------------- | ---------------------------- | -------------------------- | ---------- |
| **Access Token**  | 很短（几分钟～几小时） | 每次请求时携带，用于访问 API | header 或 cookie           | 泄露损失小 |
| **Refresh Token** | 较长（几天～几周）     | 用于获取新的 Access Token    | HttpOnly cookie / 安全存储 | 泄露损失大 |

核心思想是：

> Access Token 是“临时通行证”；
> Refresh Token 是“换票凭证”。

---

## 二、完整流程图式理解

```
[登录成功]
      ↓
  签发两个token：
    ├─ Access Token（有效期短，比如15分钟）
    └─ Refresh Token（有效期长，比如7天）
      ↓
[客户端发请求]
      ↓
  用 Access Token 调接口
      ↓
  Access Token 过期 → 调用刷新接口
      ↓
  发送 Refresh Token 到服务器验证
      ↓
  如果合法 → 签发新的 Access + Refresh
```

---

## 三、实战讲解（以 NestJS 为例）

### 1️⃣ 登录时返回两个 token

```ts
@Post('login')
async login(@Body() dto: LoginDto) {
  const payload = { sub: user.id, username: user.username };

  const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}
```

---

### 2️⃣ 前端保存策略

推荐：

- access token 放在内存中（或 header 使用）
- refresh token 放在 HttpOnly cookie 里（防止 JS 访问）

```http
Set-Cookie: refresh_token=xxxxx; HttpOnly; Secure; SameSite=Lax
```

---

### 3️⃣ 刷新接口（/auth/refresh）

```ts
@Post('refresh')
async refresh(@Req() req) {
  const refreshToken = req.cookies['refresh_token'];
  try {
    const payload = this.jwtService.verify(refreshToken);
    const newAccess = this.jwtService.sign({ sub: payload.sub }, { expiresIn: '15m' });
    const newRefresh = this.jwtService.sign({ sub: payload.sub }, { expiresIn: '7d' });

    // 可选：把新 refresh 写入 cookie
    return { accessToken: newAccess, refreshToken: newRefresh };
  } catch {
    throw new UnauthorizedException('Refresh token invalid or expired');
  }
}
```

---

## 四、怎么防止 refresh token 被滥用？

这是安全核心。常见防护手段：

### ✅ 1. 绑定设备/客户端

签发时把设备信息写进 token：

```ts
{ sub: user.id, deviceId: clientFingerprint }
```

验证时对比一致性。

### ✅ 2. 可撤销机制（黑名单 / Redis）

登录时把 refresh token 的 `jti`（JWT ID） 存在 Redis。
登出或强制下线时删除它。
刷新时检查是否仍然存在。

### ✅ 3. 旋转刷新（Refresh Token Rotation）

刷新后签发一个新的 refresh token，旧的立即作废。
这样即使旧 token 被窃取，也无法再使用。

---

## 五、时间线举例

| 时间点                                     | 状态 |
| ------------------------------------------ | ---- |
| 00:00 登录，拿到 access(15m) + refresh(7d) |      |
| 00:10 access 过期，请求 `/auth/refresh`    |      |
| 00:10 拿到新的 access(15m) + refresh(7d)   |      |
| 07 天后 refresh 也过期 → 需要重新登录      |      |

---

## 六、优点总结

✅ 用户体验流畅（几乎不需要重新登录）
✅ Access token 过期快 → 减少被盗风险
✅ Refresh token 可控、可撤销
✅ 适合移动端、小程序、SPA 等前后端分离架构

---

一句话总结：

> Access Token = 快速、易失的钥匙
> Refresh Token = 可以换新钥匙的备用钥匙
> 两者结合 → “短命安全 + 长期登录”

---

如果你告诉我你的小程序登录后端是 NestJS，我可以帮你写出一整套：

- 登录接口
- 刷新接口
- JWT 验证 guard
  并自动刷新 token（包括 cookie 模式和 header 模式）。
  你希望我帮你写那一套吗？

## 单 token

但是双 token 实现起来还是挺麻烦的。

所以实际上单 token 自动续期的方式用的也非常多。

单 token 的原理也很简单，就是登录后返回 jwt，每次请求接口带上这个 jwt，然后每次访问接口返回新的 jwt，然后前端更新下本地的 jwt token。

比如这个 token 是 7 天过期，那只要 7 天内访问一次系统，就会刷新 token。

7 天内不访问系统，token 过期，就需要重新登录了。

这种方案也能实现无感刷新，而且代码简单的多。
