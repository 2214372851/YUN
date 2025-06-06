---
title: Beszel 服务器监控
category: Linux
excerpt: Beszel 快速构建轻量级的服务器监控。
lastEdited: 2025年4月10日
tags: [Linux,监控,运维]
imageUrl: https://minio-endpoint.bybxbwg.fun/docs/image-20250410112704917.png
---

## 什么是 Beszel？

Beszel 是一个轻量级的服务器监控平台，包含 Docker 统计信息、历史数据和警报功能。

它拥有友好的 Web 界面、简单的配置，并且开箱即用。它支持自动备份、多用户、OAuth 身份验证和 API 访问。

![image-20250410112704917](https://minio-endpoint.bybxbwg.fun/docs/image-20250410112704917.png)

## 安装

服务会默认启动在 `8090` 端口，如果你有服务已经占用需要修改为可用的，同时如果你是云服务器还需要在安全组放行该端口，Hub 安装完成后通过 `http://ip:8090` 即可进入到 Beszel 第一次进入需要创建管理员账号。

### Hub 安装（监控平台）

#### Docker

你可以通过以下命令来启动服务
```shell
mkdir -p ./beszel_data && \
docker run -d \
  --name beszel \
  --restart=unless-stopped \
  -v ./beszel_data:/beszel_data \
  -p 8090:8090 \
  henrygd/beszel
```

当然你也可以通过 `docker-compose` 来启动服务

```yaml
services:
  beszel:
    image: henrygd/beszel:latest
    container_name: beszel
    restart: unless-stopped
    ports:
      - 8090:8090
    volumes:
      - ./beszel_data:/beszel_data
      - ./beszel_socket:/beszel_socket
```



#### 二进制

此命令下载并运行我们的 install-hub.sh 脚本。该脚本将安装最新二进制文件并创建 systemd 服务，使其在重新启动后继续运行。

- `-u` : 卸载
- `-p <port>` : 指定端口号（默认: 8090）

```shell
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-hub.sh -o install-hub.sh && chmod +x install-hub.sh && ./install-hub.sh
```

国内服务器无法访问 Github 可以采用代理的方式安装，提换 `https://` 为 `https://gh-proxy.com/`，如下所示：
```shell
curl -sL https://gh-proxy.com/raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-hub.sh -o install-hub.sh && chmod +x install-hub.sh && ./install-hub.sh
```



### Agent 安装（状态采集）

采集服务会默认启动在 `45876` 端口，如果你有服务已经占用需要修改为可用的，同时如果你是云服务器还需要在安全组放行该端口

公钥是指在 Hub 安装完成后添加服务器时自动生成的身份信息

![image-20250410111618338](https://minio-endpoint.bybxbwg.fun/docs/image-20250410111618338.png)

配置设置参考：

1. 点击添加客户端用来添加服务器（Agent）
2. 名称：可根据自己的需求自定义
3. 主机/IP：这里指的是 Agent 的 IP，公网部署填写公网 IP 即可；内网部署需要保证 Hub 和 Agent 在同一内网，此时即可填写内网地址。
4. 端口：没有特殊原因保持默认即可
5. 公钥：保持默认即可
6. 你可以通过上方的 Docker 或 二进制 选项选择部署方式，点击后面的小箭头可以查看衍生方案，海外服务器可以直接复制命令执行，国内服务器参考 Hub 安装时使用代理即可，当出现 `Beszel Agent has been installed successfully! It is now running on port 45876.` 就安装运行成功了
7. 当 Agent 安装完成后点击添加客户端等待 5S 左右即可看到服务器已经上线



## 多账号

但你配置好监控，需要去添加团队成员到其中时，点击 添加客户端 前面的人形图标点击用户即可进入后台界面，点击左上角的 `New record` 填写信息即可添加账号
![image-20250410113054555](https://minio-endpoint.bybxbwg.fun/docs/image-20250410113054555.png)

填写如下三个输入框，在箭头指向的地方为账号是否可用，不打开该账号无法登录

![image-20250410113352903](https://minio-endpoint.bybxbwg.fun/docs/image-20250410113352903.png)

点击 `systems` 后点击需要共享给账号的服务器监控，在下方找到 `users` 通过 `Open picker` 选择共享的用户，该用户登录即可查看到该监控
![image-20250410113608832](https://minio-endpoint.bybxbwg.fun/docs/image-20250410113608832.png)
