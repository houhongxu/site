# git 与 eslint 与 prettier

## git 与 eslint 与 prettier 的换行符兼容问题

关于[`git config --global core.autocrlf false`然后重新 git pull](http://doc.192.168.221.92.nip.io/docs/cli/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/web#eslint-%E8%AE%BE%E7%BD%AE%E6%96%87%E4%BB%B6%E6%8D%A2%E8%A1%8C%E6%A0%BC%E5%BC%8F)

需要配置后才能解决 eslint 中 prettier 插件的换行符兼容等问题

## 因为跨平台，win 的换行符与 mac 等的不同

- Windows 换行时，同时使用回车 CR(carriage-return character)和换行 LF(linefeed character)
- Mac 并且 Linux 只使用换行符 LF
- 旧版本 Mac 使用回车 CR

所以需要统一规范

## 统一仓库为 LF 换行符

首先配置仓库的 eslint 规则，一般默认规则就是 lf 换行符

让开发者配置`git config --global core.autocrlf false`

然后开发者配置编辑器如 vscode `"files.eol": "\n"`(可以补充在文档)

也可以在仓库配置.gitattributes，则免于开发者配置编辑器

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

## prettier 配置

目前似乎是使用插件默认配置(可以补充在文档)
