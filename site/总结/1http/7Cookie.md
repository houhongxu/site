# Cookie

HTTP 是无状态协议

如果要保存登录状态就需要会员卡

服务器发了会员卡，浏览器需要手动保存并手动携带太麻烦了

所以有了 Cookie:浏览器自动保存与携带

## Cookie 属性

key/value 对

其他的属性：

- Max-Age/Expires：缓存时间，未配置默认为 Session Cookie
- Domain：域名，Cookie 可以跨域，配置主域名可以访问子域名
- Path：路径
- Secure：仅通过 HTTPS 协议传递
- HttpOnly：禁止`javascript`操作 Cookie，可以避免 XSS 的窃取 Cookie 的攻击
- SameSite：跨站策略，默认禁止跨站，但可以跨域，可以避免 CSRF 攻击，跨站必跨域，跨域不一定跨站

## Set-Cookie 响应头

配置 Cookie 属性给浏览器自动保存
多个 cookie 值的情况如：

```bash
Set-Cookie: username=jimu; domain=jimu.com
Set-Cookie: height=180; domain=me.jimu.com
Set-Cookie: weight=80; domain=me.jimu.com
```

## 操作 Cookie

服务器端 Set-Cookie 响应头
浏览器端通过 Javascript

```js
// 增
document.cookie = 'a=3'

// 删
js
document.cookie = 'a=3; max-age=-1;'
```

查改需要进行字符串解析，可以通过`js-cookie`库

或者通过 [CookieStore API](https://developer.mozilla.org/en-US/docs/Web/API/Cookie_Store_API)

```js
// 增
document.cookie = 'a=1'
// 删
cookieStore.delete('a')
// 改
cookieStore.set('a', '2')
// 查
cookieStore.get('a')
cookieStore.getAll()
```

## 应用场景

- 防止 CSRF 攻击
- 登录
