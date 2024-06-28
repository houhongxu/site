# sh 与 bash

sh: Shell Command Language 的简称，是[Shell Command Language](https://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html)规范的功能实现

bash/zsh/fish/dash 基于 sh 功能进行了拓展

sh 在  docker exec -it getting-started sh 中使用 echo $0 可以看到是 sh 命令行

## sh 与软硬链接

大部分操作系统使用软链接将/bin/sh 链接到真正的执行文件

如

执行 `ls -lah /bin/sh`
在 Ubuntu 中 `/bin/sh -> dash`
在 docker 镜像的 sh 终端中 `/bin/sh -> /bin/busybox`

也可以通过 echo $0 判断

在 Ubuntu 中 bash
在 docker 镜像的 sh 终端中 sh
​
