---
title: 模型调用 MCP
category: "AI, MCP"
excerpt: 目前模型调用 MCP 的两种做法。
lastEdited: 2025年3月31日
tags: [AI, MCP,Prompt,FuntionCall]
imageUrl: http://minio-endpoint.yhnotes.com/docs/mcp.jpg
---

## 什么是 MCP？

Model Context Protocol (MCP) 是一个开放协议，它使 LLM 应用与外部数据源和工具之间的无缝集成成为可能。无论你是构建 AI 驱动的 IDE、改善 chat 交互，还是构建自定义的 AI 工作流，MCP 提供了一种标准化的方式，将 LLM 与它们所需的上下文连接起来。

> 你可以理解为 MCP 就是大模型的 USB-C 接口，目前很多设备都在使用和支持该接口。大模型可以通过这些接口与外部通讯来获取来着额外的技能，MCP Server 的本质其实就是 实现了 MCP API 的 命令行（或接口）工具。



## MCP 的使用

这里不过多赘诉怎么去安装 MCP，大部分的 MCP 只需要 `npx` 或 `uvx` 就能直接使用，少部分需要配置对应功能的 API KEY，或者需要安装额外的辅助服务（例如：[mcp-server-browser-use](https://github.com/Saik0s/mcp-browser-use)） ，例如 在 `VS Code`  中使用 `Cline` 插件，他会将安装步骤发送给你的模型，这个时候模型会引导你完成安装，此时你会获得一个 `mcp_settings.json` 内容如下：

```json
{
  "mcpServers": {
    "github.com/modelcontextprotocol/servers/tree/main/src/github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}

```

此时如果你不是 `Windows` 那你会看到，你的 MCP 服务已经可用

![image-20250331153547781](http://minio-endpoint.yhnotes.com/docs/image-20250331153547781.png)

如果你是 `Windows` 那么你需要将配置改为如下

```json
{
    "mcpServers": {
        "github.com/modelcontextprotocol/servers/tree/main/src/github": {
            "command": "cmd",
            "args": [
                "/c",
                "npx",
                "-y",
                "@modelcontextprotocol/server-github"
            ],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
            },
            "disabled": false,
            "autoApprove": []
        }
    }
}

```

> 这里为什么要改为这样？
>
> 在原来的 command 执行 npx 时，由于 MCP 执行命令的环境甚至都不是 cmd 也就没有我们 `npx` 与 `uvx` 的环境变量，那么这两个命令都无法用导致 MCP 也无法使用，这里 `cmd /c`(执行字符串指定的命令然后终止) 类似 python 中的 exec，这样通过嵌套了一层 cmd 环境变量就能正常加载了



## 模型调用 MCP 的方式

### Function Call 是什么

Fucntion calling 是将 LLM 链接外部工具的一种方式。在 `openai` 中通过 tools 定义已经编写好的工具函数，但是大部分模型都不支持且需要在开发时手动编写工具函数。MCP 解决了：复用性不高、通用性不强等缺点，这点从常见的 MCP 选型就能看到 `npx` 和 `uvx` 都可以把第三方模块简易的运行起来，且安装简单可以通过二进制文件直接使用所以简单、易用恰好合适 MCP 的场景。

### Function Call

使用 Function Call 可以作为 MCP 的触发器，直接调用 MCP 服务，但是具有比较大的局限性，以 Ollama Models 为例，只有少数模型对 tools 调用支持，包括前端时间比较火的 DeepSeek R1 也不支持函数调用。

![image-20250331174551602](http://minio-endpoint.yhnotes.com/docs/image-20250331174551602.png)

### System Prompt

作为一个通用接口，并非没有 Function Call 就无法使用 MCP 服务，我们可以通过 System Prompt 将工具信息告诉模型，并告知模型需要调用时的使用方式。

```xml
<system>
你是一个专业的 AI 助手，擅长使用各种工具解决问题。你将以专业、友好的态度与用户交流，提供准确和有价值的帮助。
</system>

<persona>
- 专业性：你具备丰富的技术知识和经验
- 思维方式：逻辑清晰，善于分析问题
- 沟通风格：友好、耐心，注重用户体验
- 工作态度：严谨认真，注重细节
</persona>

<instructions>
1. 分析用户需求：
   - 仔细理解用户的问题和目标
   - 确定解决问题所需的工具和步骤

2. 工具使用规范：
   - 在使用工具前，说明选择该工具的原因，并且同时触发工具调用，不要等到下一轮对话。比如：
     * "我将生成第一组随机数。<tool_call>
  <name>generateRandom</name>
  <arguments>
    {
      "type": "number",
      "min": 100,
      "max": 10000
    }
  </arguments>
</tool_call>"
     * "我将生成 3 组随机数。<tool_call>...</tool_call><tool_call>...</tool_call><tool_call>...</tool_call>"
   - 如果需要连续调用工具，请说明，并且同时触发工具调用，不要等到下一轮对话。比如 "我将生成第二组随机数。<tool_call>
  <name>generateRandom</name>
  <arguments>
    {
      "type": "number",
      "min": 100,
      "max": 10000
    }
  </arguments>
</tool_call>"
   - 如果工具调用失败或超时，请说明，并且同时触发工具调用，不要等到下一轮对话。比如 "工具调用失败，让我进行重试。<tool_call>
  <name>generateRandom</name>
  <arguments>
    {
      "type": "number",
      "min": 100,
      "max": 10000
    }
  </arguments>
</tool_call>"
   - 每次可调用多个工具，如果没有依赖关系，尽量同时调用，如果有依赖关系，才依次调用
   - 如果用户明确要求依次调用才依次调用
   - 确保工具调用格式正确，参数完整

3. 回答质量要求：
   - 提供清晰、准确、结构化的答案
   - 承认知识限制，不随意猜测或编造
   - 主动跟进和验证结果
</instructions>

<available_tools>
<tool name="generateRandom">
  <description>生成随机数字</description>
  <parameters>
{
  "type": "object",
  "properties": {
    "min_value": {
      "type": "number",
      "description": "当type为number时的最小值（包含）"
    },
    "max_value": {
      "type": "number",
      "description": "当type为number时的最大值（包含）"
    }
  },
  "required": [
    "min_value",
    "max_value"
  ]
}
  </parameters>
</tool>
</available_tools>

<tool_call_format>
工具调用必须严格使用以下 XML 格式：

<tool_call>
  <name>工具名称</name>
  <arguments>
    {
      "参数1": "值1",
      "参数2": "值2"
    }
  </arguments>
</tool_call>

注意事项：
1. 必须使用上述 XML 格式，不接受 function_call 格式
2. 确保 <name/> 标签中的工具名称准确无误
3. 参数必须使用有效的 JSON 格式
4. 等待工具执行完成后再继续对话
5. 验证参数符合工具的要求规范
</tool_call_format>
```

例如以以下提示词，那么模型在需要外部工具的时候就会在需要的时候以以下格式返回：

```xml
<tool_call>
  <name>generateRandom</name>
  <arguments>
    {
      "min_value": 33,
      "max_value": 66
    }
  </arguments>
</tool_call>
```

示例：

```python
import json
import os
import random

from openai import OpenAI
from dotenv import load_dotenv
from xml.etree import ElementTree as ET
from pathlib import Path

load_dotenv()

messages = [
    {
        "role": "system",
        "content": Path("system-prompt").read_text(encoding="utf-8") # 上方 System Prompt
    }
]
model = "deepseek/deepseek-chat-v3-0324:free"

client = OpenAI(
    # This is the default and can be omitted
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ.get("API_KEY"),
)


def send_message(message, role="user"):
    messages.append({
        "role": role,
        "content": message
    })
    response = client.chat.completions.create(
        model=model,
        messages=messages
    )
    messages.append({
        "role": "assistant",
        "content": response.choices[0].message.content
    })
    return response.choices[0].message.content


def generate_random_number(min_value, max_value):
    # 生成随机数的逻辑
    return random.randint(min_value, max_value)


result = send_message('帮我生成33~66之间的2个数')
print(result)
if 'tool_call' in result:
    tool_result = "[工具调用结果]\n\n"
    xml_text = f"<root>{result}</root>"

    root = ET.fromstring(xml_text)
    print(root.text.strip())

    tool_calls = root.findall(".//tool_call")

    for i, tool_call in enumerate(tool_calls, 1):
        tool_call_str = ET.tostring(tool_call, encoding="unicode")
        name = tool_call.find("name").text
        arguments = tool_call.find("arguments").text
        json.loads(arguments)
        if name == 'generateRandom':
            args = json.loads(arguments)
            rs = generate_random_number(**args)
            tool_result += f"<tool_call>\n  <name>{name}</name>\n  <result>\n    {rs}\n  </result>\n</tool_call>\n\n"
    result = send_message(tool_result, 'assistant')
    print(result)

print('------------------------')

```

这里我实现了一个简易的调用过程，当 result 返回告知我们需要调用工具时，我们就执行工具并以 `assistant` 它自己的身份返回信息告知他工具结果

```xml
<tool_call>
  <name>generateRandom</name>
  <result>
    33
  </result>
</tool_call>

<tool_call>
  <name>generateRandom</name>
  <result>
    61
  </result>
</tool_call>
```



## 总结

这就是目前的两种解决方法，Function Call 对模型有要求，System Prompt 又会导致上下文特别长。分别对应 Cherry studio（Function Call），VS Code Cline（System Prompt），各有优势。





