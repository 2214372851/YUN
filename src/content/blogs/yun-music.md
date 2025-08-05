---
title: "YUN Music MCP 服务"
category: "技术, API工具"
excerpt: "介绍MCP音乐服务器的功能及使用方法，包括搜索歌曲和获取歌曲详情，帮助开发者快速集成音乐服务。"
lastEdited: "2025年6月5日"
tags: ["MCP", "API", "音乐"]
imageUrl: https://minio-endpoint.yhnotes.com/docs/yun-music.png
---

## 什么是MCP音乐服务?

MCP（Model Context Protocol）音乐服务是一组通过本地化代理提供的音乐API，从第三方站点获取歌曲数据。它解决了以下痛点：

> "开发者无需自行维护音乐数据源，通过标准化接口即可快速实现音乐搜索、播放等核心功能"

服务采用轻量级HTTP协议通信，返回结构化的JSON数据，适合集成到各类应用中。

## MCP 配置

本服务是 SSE 在线 MCP Server，所以你可以无需安装依赖包直接使用该工具，你可以通过在 Claude、Cursor、CherryStudio 等支持 MCP 工具的客户端中使用。

```json
{
  "mcpServers": {
    "yun-music": {
      "url": "http://mcp.yhnotes.com/music"
    }
  }
}
```

## 核心功能与原理

### 1. 搜索服务
- **原理**：通过关键词模糊匹配歌曲库
- **数据源**：实时查询gequbao.com的公开数据
- **示例**：搜索"周杰伦"会同时返回歌曲、专辑、Live版本等

```python
# 类比：类似音乐平台的全局搜索栏
response = search_music(keyword="稻香")
```

### 2. 详情服务
- **原理**：根据歌曲唯一标识（detail_url）获取元数据：
  - 高音质播放链接（128kbps+ MP3）
  - LRC格式时间轴歌词
  - 专辑封面（500px分辨率）

```json
{
  "title": "稻香",
  "author": "周杰伦",
  "cover": "http://.../cover.jpg",
  "play_url": "https://.../audio.mp3",
  "lyrics": "[00:00.0]稻香 - 周杰伦..."
}
```

## 基础使用方法
### 1. 搜索歌曲
通过`search_music`工具发起请求：

```javascript
// 伪代码示例
const results = await mcpTool({
  server_name: "music",
  tool_name: "search_music",
  arguments: { keyword: "晴天" }
});
```

### 2. 获取播放资源
使用上一步的`detail_url`获取详情：

```bash
# 命令行示例（需替换URL）
curl -X POST -d '{
  "detail_url": "/music/4190"
}' http://mcp.yhnotes.com/music/get_music_detail
```

## 常见问题与建议
1. **版权注意事项**：
   > "返回的播放链接来自第三方平台，商用前请确认版权授权状态"

3. **错误处理**：
   - 搜索无结果时返回空数组（非错误）
   - 无效detail_url会返回404状态码
   - 如果你遇到长时间为响应，那么我建议你暂停并刷新一下工具重试（有该问题但目前不清楚原因）
   
4. **扩展建议**：
   
   ```python
   # 最佳实践：添加重试机制
   def safe_get_detail(url, retries=3):
       while retries > 0:
           try:
               return get_music_detail(url)
           except TimeoutError:
               retries -= 1
       return None
   ```

> 提示：当前版本暂不支持按歌手/专辑筛选，但可以通过结果集的author字段实现客户端过滤
