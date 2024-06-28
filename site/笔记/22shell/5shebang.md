# shebang

`#!` 被称作 shebang，或者 hashbang，hash 是 # 的意思，bang 是 ! 的意思

对于可直接执行的文件，首行添加一行 shebang 说明，指明执行环境

```bash
#!/usr/bin/env bash

echo "hello, world"
```

```js
#!/usr/bin/env bash

echo "hello, world"
```

其中 /usr/bin/env 就是命令 env，/usr/bin 就是 PATH 中的目录，所以平时可以直接使用 env，这里使用的是绝对路径

env bash 就是执行 bash
