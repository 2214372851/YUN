---
title: JuiceFS 分布式文件系统
category: "分布式,文件系统"
excerpt: JuniceFS 分布式文件系统安装与使用
lastEdited: 2025年7月26日
tags: [文件系统,分布式,Posix,对象存储]
---

## JuiceFS 简介

[JuiceFS](https://juicefs.com/) 是一款高性能的开源分布式文件系统，兼容 POSIX 标准，底层使用对象存储作为数据存储，Redis、MySQL、PostgreSQL 等作为元数据引擎。它能提供本地文件系统一样的操作体验，并具备分布式架构的可扩展性，非常适合大数据、机器学习、容器持久化存储等场景。

## 主要特性

- **POSIX 兼容**：支持 `ls`, `cp`, `mv`, `rm` 等常规文件系统操作。

- **数据存储即对象存储**：兼容所有主流对象存储服务，如 Amazon S3、阿里云 OSS、MinIO 等。

- **元数据存储可选**：支持 Redis（高性能）、MySQL/PostgreSQL（持久化）等作为元数据引擎。

- **高性能与可扩展性**：支持并发读写、缓存加速。

## 安装与使用

### 安装 Redis 数据库与 Minio 对象存储

> 如下是 JuiceFS 的技术架构图，单机模式没太大的实用意义就略过了，JuiceFS 依赖外部数据库作为元数据管理，且数据也是存储在对象存储等外部存储内，所以此处需要先安装其依赖

![JuiceFS 架构图](https://juicefs.com/docs/zh/assets/images/juicefs-arch-a6ce1972428aba63e37ab4455a0a3581.svg)

本处采用 Docker 快速安装 Redis 与 Minio：

::: warn
本处为了开始所以数据放到了 `～/docker-data` 下实际使用时需要合理规划
:::

- 安装 Redis

```shell
mkdir -p ~/docker-data/redis

docker run -d --name redis \
  -p 6379:6379 \
  -v ~/docker-data/redis:/data \
  redis \
  redis-server --appendonly yes
```

- 安装 Minio

```shell
docker run -d --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=admin123" \
  -v ~/docker-data/minio:/data \
  minio/minio:RELEASE.2025-02-18T16-25-55Z server /data --console-address ":9001"
```

### 安装 JuiceFS

一键安装脚本适用于 Linux 和 macOS 系统，会根据你的硬件架构自动下载安装最新版 JuiceFS 客户端。

```shell
# 默认安装到 /usr/local/bin
curl -sSL https://d.juicefs.com/install | sh -
```



### 创建文件系统

初次使用时你需要先创建一个文件系统，首先你需要创建一个存储桶（Bucket），此处我的桶名为 `test`，后续添加更多节点来挂载的时候就不需要该步骤了

```shell
juicefs format \
    --storage minio \
    --bucket http://127.0.0.1:9000/test \
    --access-key admin \
    --secret-key admin123 \
    redis://root:@127.0.0.1:6379/1 \
    myjfs
```

此时你可以看到 Minio Console 中的 test 桶中出现了一个 myjfs 的目录

### 挂载文件系统

::: warn
这里需要注意我在当前主机上使用的都是回环地址 `127.0.0.1`，在当前机器上没问题，但是其它节点挂载时需要将该地址改为该节点可以访问的外部地址
:::

```shell
juicefs mount redis://root:@127.0.0.1:6379/1 /mnt/jfs
```

挂载成功可以在 `/mnt/jfs` 中看到一些隐藏文件:

- `.accesslog`
- `.config`
- `.stats`
- `.trash/`

现在文件系统已经被挂载，上传一个文件就可以看到 Minio 中 `test/myjfs/chunks`，该目录存储的就是文件数据

### 验证文件系统

当挂载好文件系统以后可以通过 `juicefs bench` 命令对文件系统进行基础的性能测试和功能验证，确保 JuiceFS 文件系统能够正常访问且性能符合预期。

```shell
root@a1:/mnt/juicefs# juicefs bench /mnt/jfs/
  Write big blocks: 1024/1024 [==============================================================]  170.5/s  used: 6.007631192s
   Read big blocks: 1024/1024 [==============================================================]  302.9/s  used: 3.381161322s
Write small blocks: 100/100 [==============================================================]  191.6/s  used: 521.981155ms
 Read small blocks: 100/100 [==============================================================]  1062.2/s used: 94.173419ms 
  Stat small files: 100/100 [==============================================================]  4927.8/s used: 20.320919ms 
Benchmark finished!
BlockSize: 1.0 MiB, BigFileSize: 1.0 GiB, SmallFileSize: 128 KiB, SmallFileCount: 100, NumThreads: 1
Time used: 10.4 s, CPU: 50.7%, Memory: 196.7 MiB
+------------------+------------------+--------------+
|       ITEM       |       VALUE      |     COST     |
+------------------+------------------+--------------+
|   Write big file |     170.46 MiB/s |  6.01 s/file |
|    Read big file |     302.90 MiB/s |  3.38 s/file |
| Write small file |    191.8 files/s | 5.21 ms/file |
|  Read small file |   1068.1 files/s | 0.94 ms/file |
|        Stat file |   5012.5 files/s | 0.20 ms/file |
|   FUSE operation | 17832 operations |   0.14 ms/op |
|      Update meta |   321 operations |   0.64 ms/op |
|       Put object |   356 operations |  25.13 ms/op |
|       Get object |   256 operations |  50.15 ms/op |
|    Delete object |     0 operations |   0.00 ms/op |
| Write into cache |   356 operations |   7.01 ms/op |
|  Read from cache |   100 operations |   0.08 ms/op |
+------------------+------------------+--------------+
```

### 卸载文件系统

卸载文件系统
你可以通过 juicefs umount 命令卸载 JuiceFS 文件系统（假设挂载点路径是 `/mnt/jfs`）：

```shell
juicefs umount /mnt/jfs
```

如果执行命令后，文件系统卸载失败，提示 Device or resource busy：

```shell
2021-05-09 22:42:55.757097 I | fusermount: failed to unmount ~/jfs: Device or resource busy
exit status 1
```

发生这种情况，可能是因为某些程序正在读写文件系统中的文件。为了确保数据安全，你应该首先排查是哪些程序正在与文件系统中的文件进行交互（例如通过 lsof 命令），并尝试结束它们之间的交互动作，然后再重新执行卸载命令。

> 有强制卸载，不推荐就不放这了



## 总结

1. 挂载到外部存储中，写入的文件存在的形式不是文件，例如 Minio 中被分为了多个 chunk 每一个 chunk 是一个 Object
2. 数据一致性，在多节点有写有读时，文件句柄未关闭前，读节点不一定能看到更新，如果此时不是读操作是写操作也会导致无法按照预期，可以考虑使用 filelock 避免同时操作
3. 默认情况下，JuiceFS 会在 `$HOME/.juicefs/cache` 或 `/var/jfsCache` 目录设置 100GiB 的缓存。在速度更快的 SSD 上设置更大的缓存空间可以有效提升 JuiceFS 的读写性能。使用 `--cache-dir` 调整缓存目录的位置，使用 `--cache-size` 调整缓存空间的大小，
4. 使用 Redis 时，每一个文件的元数据会大约占用 300 字节内存。因此，如果要存储 1 亿个文件，大约需要 30GiB 内存。使用 MySQL 等数据库时数据是被写到硬盘，所以速度会慢。
