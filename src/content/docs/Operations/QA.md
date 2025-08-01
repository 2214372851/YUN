---
title: 常见问题
---

## OpenResty 代理 Minio Endpoint

代理 Minio 时 HEAD 请求会被转为 GET 请求，导致请求 403 的问题

> 默认情况下，当客户端发起 HEAD 请求时，Nginx 会使用缓存中相应的 GET 响应并“伪造”一个 HEAD 响应（不包含 body，仅返回 headers 和状态码）。

```nginx
proxy_cache_convert_head off;  
```

在对 MinIO（或 S3）做反代时：

- 有些客户端（如 minio-py）发出的 HEAD 请求希望真实获取服务器响应（包括 header 中如 ETag, x-amz-meta-* 等）
- 如果你开启了缓存（proxy_cache），**且未设置 proxy_cache_convert_head off;，你就可能收到不准确或被简化的响应头**
- 有些服务还会拒绝伪造的 HEAD 响应（比如触发认证失败或签名校验失败）