# chmod 与 chown

## chmod

change mode

更改文件的读写权限

### 文件权限

- r: 可读，二进制为 100，也就是 4
- w: 可写，二进制为 010，也就是 2
- x: 可执行，二进制为 001，也就是 1

## chown

change owner

更改文件所属用户及组

### 用户分类

- user，文件当前用户
- group，文件当前用户所属组
- other，其它用户

## 查看

通过命令 `ls -alh` 查看用户和用户组

```bash
total 132K
drwxr-x--- 14 ubuntu ubuntu 4.0K Jan 12  2024 .
drwxr-xr-x  4 root   root   4.0K Sep 21  2023 ..
-rw-------  1 ubuntu ubuntu  30K Jul 15 13:18 .bash_history
-rw-r--r--  1 ubuntu ubuntu  220 Jan  7  2022 .bash_logout
-rw-r--r--  1 ubuntu ubuntu 4.0K Oct  8  2023 .bashrc
drwxrwxr-x 12 ubuntu ubuntu 4.0K Oct  2  2023 ble.sh-dir
drwx------  4 ubuntu ubuntu 4.0K Oct  4  2023 .cache
drwx------  4 ubuntu ubuntu 4.0K Oct  8  2023 .config
drwx------  3 ubuntu ubuntu 4.0K Oct  8  2023 .docker
drwxrwxr-x  3 ubuntu ubuntu 4.0K Oct 23  2023 docker-demo
-rw-------  1 ubuntu ubuntu   20 Oct 23  2023 .lesshst
drwxrwxr-x  5 ubuntu ubuntu 4.0K Oct  8  2023 .local
drwxr-xr-x  2 ubuntu ubuntu 4.0K Jan  9  2024 nginx
drwxrwxr-x  3 ubuntu ubuntu 4.0K Sep 21  2023 .npm
drwxrwxr-x  8 ubuntu ubuntu 4.0K Sep 21  2023 .nvm
drwxrwxr-x  2 ubuntu ubuntu 4.0K May 18  2022 .pip
-rw-r--r--  1 ubuntu ubuntu  807 Jan  7  2022 .profile
-rw-rw-r--  1 ubuntu ubuntu   73 Sep 21  2023 .pydistutils.cfg
-rw-------  1 ubuntu ubuntu    7 Sep 28  2023 .python_history
drwx------  2 ubuntu ubuntu 4.0K May 18  2022 .ssh
-rw-r--r--  1 ubuntu ubuntu    0 Sep 21  2023 .sudo_as_admin_successful
-rw-------  1 ubuntu ubuntu  12K Oct 23  2023 .viminfo
drwxrwxr-x  5 ubuntu ubuntu 4.0K Oct 26  2023 .vscode-server
-rw-rw-r--  1 ubuntu ubuntu  183 Sep 21  2023 .wget-hsts
```

通过命令 `stat -c %A nginx` 或者 `stat -c %a nginx` 查看权限

```bash
# stat -c %A nginx
drwxr-xr-x
# stat -c %a nginx
755
```

所以 常用的 `chmod 777 nginx` 即 rwx、rwx、rwx

也可以使用可读命令`chmod +rwx nginx`

命令帮助为 `$ chmod [ugoa...][[+-=][perms...]...]`

ugo 对应 user,group,other，a 对应 all，符号对应加减等
