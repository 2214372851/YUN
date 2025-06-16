---
title: 常用命令
---

## 内网穿透（云服务器）

#### **🎯 目标**

将本地机器的 22 端口（SSH 服务端口）通过 SSH 隧道映射到远程服务器的 3000 端口，实现内网穿透访问本地的 SSH 服务。

### **一、命令说明**

#### **1. 命令格式**

```bash
ssh -N -R [远程端口]:[本地地址]:[本地端口] user@remote_host
```

#### **2. 示例**

将本地 22 端口转发到远程服务器的 3000 端口：

```bash
ssh -fN -R 3000:localhost:22 user@remote_host
```

#### **3. 参数解释**

- -f：后台运行 SSH 连接
- -N：不执行远程命令，仅用于端口转发
- -R 3000:localhost:22：远程服务器监听 3000 端口，转发连接到本地的 22 端口
- user@remote_host：远程服务器的用户名和地址

### **二、远程服务器配置要求**

远程服务器需要允许远程端口转发。

#### **1. 修改 SSH 配置文件**

```bash
sudo vim /etc/ssh/sshd_config
```

添加或修改以下内容：

```bash
AllowTcpForwarding yes
GatewayPorts yes
```

#### **2. 重启 SSH 服务**

```bash
sudo systemctl restart sshd
```

### **三、连接测试**

在远程服务器上测试连接：

```bash
ssh -p 3000 localhost
```

如果一切设置正确，这条命令将登录本地机器的 SSH 服务。

### **四、关闭后台运行的 SSH 隧道**

#### **方法一：使用 ps + kill**

1. 查找 SSH 转发进程：

```bash
ps aux | grep 'ssh -fN -R'
```

1. 杀掉对应进程：

```bash
kill [PID]
```

示例：

```bash
kill 12345
```

#### **方法二：使用 pkill 快速关闭**

```bash
pkill -f 'ssh -fN -R'
```

注意：这将关闭所有使用该命令格式启动的 SSH 转发进程。

### **五、使用 autossh 实现自动重连（可选）**

#### **1. 安装 autossh**

```bash
sudo apt install autossh
```

#### **2. 启动命令**

```bash
autossh -fN -R 3000:localhost:22 user@remote_host
```

也可以配合 systemd 或 supervisor 等工具长期运行。

## SSH 免密登录

1. 在本地机器生成密钥对
   `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`

   连续按几次回车，默认生成在 ~/.ssh/id_rsa 和 ~/.ssh/id_rsa.pub

2. 将公钥复制到被连接主机

   - 使用 ssh-copy-id 自动拷贝

     `ssh-copy-id username@remotehost`

   - 手动复制

     `cat ~/.ssh/id_rsa.pub | ssh username@remotehost 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh'`

     将`~/.ssh/id_rsa.pub`里的文本放到远程主机 `~/.ssh/authorized_keys`

## fd 的安装及使用

[fd](https://github.com/cha0ran/fd-zh)

### 安装

在Ubuntu上和其他基于Debian的Linux发行版。

`sudo apt install fd-find`


> 安装好后命令为 `fdfind`，因为另一个软件包已经使用了 `fd` 这个名称。通过执行 `ln -s $(which fdfind) ~/.local/bin/fd` 命令来添加 `fd` 的链接，以便以与本文档相同的方式使用 `fd`。请确保 `$HOME/.local/bin` 在你的 `$PATH` 中。或者通过 `alias fd=fdfind`。

### 使用

```bash
# 简单搜索:递归搜索当前目录中任何包含 netfl 模式的条目
fd search-string

# 正则表达式搜索:搜索模式被当作一个正则表达式来处理，以 x 开头、以 rc 结尾的条目
fd '^x.*rc$' # X11/xinit/xinitrc

# 指定根目录
fd passwd /etc

# 列出所有文件，递归。类似ls -R
fd
# 列出所有文件，递归。列出一个给定目录中的所有文件，必须使用一个全包模式，如 . 或 ^
fd . /data

# 搜索一个特定的文件扩展名
fd -e py
# 配合搜索模式使用
fd -e py task # src/fshelper/task.py

# 搜索一个特定的文件名
fd -g libc.so /usr
fd -g *.so /user

# 隐藏和忽略的文件
fd -H pre-commit

# 匹配完整路径
fd -p -g '**/.git/config'
fd -p '.*/lesson-\d+/[a-z]+.(jpg|png)'

# 命令执行
fd -e zip -x unzip # 递归找到所有的压缩文件并解压
# 占位符语法
# {}： 一个占位符，将被替换为搜索结果的路径（documents/images/party.jpg）。
# {.}：和 {} 一样，但没有文件扩展名（documents/images/party）。
# {/}：一个占位符，将被搜索结果的基本名称（party.jpg）取代。
# {//}：已发现路径的父级（documents/images）。
# {/.}：去掉扩展名的基本名（party）。
fd -e jpg -x convert {} {.}.png
# 并行执行与串行执行
# 对于 -x/--exec，你可以通过使用 -j/--threads 选项控制并行作业的数量。使用 --threads=1 进行串行执行

# 排除特定的文件或目录
fd -H -E .git
fd -E /mnt/external-drive
fd -E '*.bak'
```



## Windows 安装 NeoVim 及 LazyVim

[LazyVim](https://lazyvim-github-io.vercel.app/zh-Hans/keymaps)

```bash
# 安装必备软件
scoop install neovim git gcc ripgrep fd unzip tree-sitter luarocks
 
# 下载安装 LazyVim 配置
git clone https://github.com/LazyVim/starter $env:LOCALAPPDATA\nvim --depth=1
```



## Windows 安装 Scoop

```bash
# 脚本执行策略更改，默认自动同意
Set-ExecutionPolicy RemoteSigned -scope CurrentUser -Force
 
# 执行安装命令（默认安装在用户目录下，如需更改请执行 “自定义安装目录” 命令）
iwr -useb scoop.201704.xyz | iex # 如果想自定义安装目录请不要执行这行命令
 
## 自定义安装目录（注意将目录修改为合适位置)
irm scoop.201704.xyz -outfile 'install.ps1'
 
.\install.ps1 -ScoopDir 'E:\Scoop' -ScoopGlobalDir 'E:\GlobalScoopApps'
```



## Ubuntu 安装 Google Chrome

### 1.下载谷歌浏览器

通过使用`Ctrl+Alt+T`键盘快捷键或单击终端图标来打开终端

使用wget下载最新的Google Chrome `.deb`软件包：

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
```

### 2.安装Google Chrome

在Ubuntu上安装软件包需要管理权限。以具有sudo特权的用户身份运行以下命令，以`.deb`在系统上安装Chrome 软件包：

```bash
sudo apt install ./google-chrome-stable_current_amd64.deb
```

## 服务器速度测试

### 完整测试

`bash <(wget -qO- https://down.vpsaff.net/linux/speedtest/superbench.sh)`

或

`wget -qO- https://down.vpsaff.net/linux/speedtest/superbench.sh | sudo bash`

### **精简模式**

跳过 Geekbench v5 和国际 speedtest [网络测试](https://zhida.zhihu.com/search?content_id=211258886&content_type=Article&match_order=1&q=网络测试&zhida_source=entity)

```bash
bash <(wget -qO- https://down.vpsaff.net/linux/speedtest/superbench.sh) -f
```

### **Speedtest**

仅进行 speedtest 国内网络测试

```bash
bash <(wget -qO- https://down.vpsaff.net/linux/speedtest/superbench.sh) --speed
```

### **流媒体测试**

```bash
bash <(wget -qO- https://down.vpsaff.net/linux/speedtest/superbench.sh) -m
```

## Git仓库代码行数统计

### 不显示内容

`git ls-files | xargs cat | wc -l`

### 显示内容

`git ls-files | xargs wc -l`

## VMware 挂载本地文件夹

查看共享文件夹是否存在

`vmware-hgfsclient`

将所有文件夹挂载到 `/mnt/hgfs`

`sudo vmhgfs-fuse .host:/ /mnt/hgfs -o subtype=vmhgfs-fuse,allow_other`

## Miniconda 静默安装

```shell
#!/bin/bash

# 创建miniconda3目录
mkdir -p ~/miniconda3

# 下载Miniconda安装脚本
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh

# 执行安装脚本
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3

# 初始化Conda
~/miniconda3/bin/conda init bash

# 刷新shell
source ~/.bashrc

echo "Miniconda安装和初始化完成"

```

## ffmpeg ts视频转mp4视频

```bash
ffmpeg -i input.ts -c copy -map 0:v -map 0:a -bsf:a aac_adtstoasc .\output.mp4
```

## Linux统计文件夹及其子文件夹中文件个数

```bash
find /path/dir -type f | wc -l
```

## Linux把查询出来的进程全部杀死

```bash
ps -ef | grep workcommod | awk '{print $2}' | xargs kill -9
```

## Linux查看文件列表时排序

在n后面加上r可倒序

```bash
ll | awk '{print $9}' | sort -k1.1n
```

## ssh 端口转发至本地

这里是将服务器本地的9090端口转发到当前机器实现当前机器的`localhost:9090`访问远程主机的`9090`端口

```bash
ssh -CNgv -L 9090:127.0.0.1:9090 username@host -p port
```
