# git 与 eslint 与 prettier

## git 与 eslint 与 prettier 的换行符兼容问题

关于[`git config --global core.autocrlf false`然后重新 git pull](http://doc.192.168.221.92.nip.io/docs/cli/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/web#eslint-%E8%AE%BE%E7%BD%AE%E6%96%87%E4%BB%B6%E6%8D%A2%E8%A1%8C%E6%A0%BC%E5%BC%8F)

需要配置后才能解决 eslint 中 prettier 插件的换行符兼容等问题

## 因为跨平台，win 的换行符与 mac 等的不同

- Windows 换行时，同时使用回车 CR(carriage-return character)和换行 LF(linefeed character)
- Mac 并且 Linux 只使用换行符 LF
- 旧版本 Mac 使用回车 CR

所以需要统一规范

## 推荐统一仓库为 LF 换行符

首先配置 git 避免自动转换换行符与提交时警告

让 win 开发者配置`git config --global core.autocrlf true`和`git config --global core.safecrlf warn`
让 mac 开发者配置`git config --global core.autocrlf input`和`git config --global core.safecrlf warn`

但是更推荐配置仓库，使用.gitattributes 文件

```yml
# Set the default behavior, in case people don't have core.autocrlf set.
* text eol=lf
```

### 命令解释

```bash
// 提交时转换为LF，检出时转换为CRLF
git config --global core.autocrlf true

// 提交时转换为LF，检出时不转换
git config --global core.autocrlf input

// 提交检出均不转换
git config --global core.autocrlf false
```

```bash
// 拒绝提交包含混合换行符的文件
git config --global core.safecrlf true

// 允许提交包含混合换行符的文件
git config --global core.safecrlf false

// 提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn
```

通过 vscode files.eol 控制自动转换

或者要改变 git 也可以使用 .gitattributes 根据仓库配置

```git
# Set the default behavior, in case people don't have core.autocrlf set.
* text eol=lf
```

## prettier 配置需要统一写在文档

目前似乎是使用插件默认配置，需要在文档提醒
