---
title: LangGraph 快速上手与进阶实践
category: "AI 开发,工作流自动化"
excerpt: "LangGraph 是专为大语言模型和多智能体工作流打造的高级框架，支持节点编排、工具集成、记忆管理、人工介入和“时间旅行”等特性。本文将以简洁实用的方式，带你快速上手 LangGraph 并掌握进阶用法，从零到一构建强大的 AI 工作流应用。"
lastEdited: 2025年8月15日
tags: [LangGraph,LLM,Python,AI 工作流,人工智能]
---

随着大语言模型（LLM）和多智能体应用的兴起，LangGraph 作为一款“有状态工作流编排”AI 框架，正在成为新一代智能应用的强力引擎。无论你是希望打造多轮对话助手，还是需要复杂流程自动化，这篇文章都将以简洁实用的风格，带你快速掌握 LangGraph 的核心用法与进阶实践。

---

## 一、LangGraph 简介

LangGraph 是一个为 LLM 应用设计的“状态机式”工作流自动化框架。通过节点（Node）、边（Edge）、工具（Tool）和全局状态（State）的灵活组合，你可以轻松实现多轮对话、工具调用、结构化信息流转、人工介入甚至“时间旅行”等高级能力。

---

## 二、核心概念

- **State（状态）**：全局数据载体，贯穿每一轮对话和每个节点。
- **Node（节点）**：处理输入状态并返回新状态的原子操作单元，通常对应 LLM、工具函数等。
- **Edge（边）**：定义节点间的流转关系，可设置条件分支。
- **Tool（工具）**：可供 LLM 调用的外部能力，如搜索、数据库、人工回传等。
- **Checkpointer（检查点）**：负责状态的持久化，实现多轮记忆与“时间旅行”。

---

## 三、快速上手

### 1. 安装

```bash
pip install langgraph
```

### 2. 创建智能代理（Agent）

以天气查询为例，三步即可创建一个基础 AI Agent：

```python
from langgraph.prebuilt import create_react_agent

def get_weather(city: str) -> str:
    """获取城市天气"""
    return f"It's always sunny in {city}!"

agent = create_react_agent(
    model='',  # 这里可接入任意 LLM
    tools=[get_weather],
    prompt="You are a helpful assistant"
)

response = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
print(response)
```

### 3. 配置 LLM

灵活支持第三方大模型，例如火山方舟 Kimi-K2：

```python
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

llm = ChatOpenAI(
    model="kimi-k2-250711",
    temperature=0.7,
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=SecretStr('ak-xxxxxxx')
)
```

---

## 四、进阶用法

### 1. 动态提示词与个性化

支持根据上下文动态生成系统提示词，实现更自然的智能体行为：

```python
def prompt(state, config):
    user_name = config["configurable"].get("user_name", "用户")
    system_msg = f"You are a helpful assistant. Address the user as {user_name}."
    return [{"role": "system", "content": system_msg}] + state["messages"]

agent = create_react_agent(
    model=llm.llm,
    tools=[get_weather],
    prompt=prompt
)

resp = agent.invoke(
    {"messages": [{"role": "user", "content": "How is the weather in Shanghai today?"}]},
    config={"configurable": {"user_name": "云海"}}
)
print(resp)
```

---

### 2. 添加记忆功能（多轮对话上下文）

只需一行即可让你的 Agent 具备持久会话能力：

```python
from langgraph.checkpoint.memory import InMemorySaver

checkpointer = InMemorySaver()
agent = create_react_agent(
    model=llm,
    tools=[get_weather],
    checkpointer=checkpointer
)

config = {"configurable": {"thread_id": "1"}}
sf_resp = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]},
    config
)
ny_resp = agent.invoke(
    {"messages": [{"role": "user", "content": "what about new york?"}]},
    config
)
```

---

### 3. 结构化输出

便于和第三方系统集成，支持 Pydantic 结构化响应（需模型支持 JSON Schema）：

```python
from pydantic import BaseModel

class WeatherResponse(BaseModel):
    conditions: str

agent = create_react_agent(
    model=llm.llm,
    tools=[get_weather],
    response_format=WeatherResponse
)

response = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
print(response["structured_response"])
```

---

## 五、工作流（Workflow）实战

LangGraph 的强大之处在于你可以像搭积木一样，拼接节点、自定义状态，实现复杂业务流。

### 1. 基础状态机设计

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]

graph_builder = StateGraph(State)

def chatbot(state: State):
    return {"messages": ["Agent回复内容"]}

graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()
```

### 2. 工具集成与条件分支

让 Agent 能自动决定何时调用外部搜索/数据库等工具：

```python
from langchain_tavily import TavilySearch
from langgraph.prebuilt import ToolNode, tools_condition

search_tool = TavilySearch(max_results=2)
tools = [search_tool]
llm_with_tools = llm.bind_tools(tools)

def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

graph_builder.add_node("chatbot", chatbot)
tool_node = ToolNode(tools=tools)
graph_builder.add_node("tools", tool_node)
graph_builder.add_conditional_edges("chatbot", tools_condition)
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile()
```

---

### 3. 多轮记忆与持久化

只需为编译时传入 checkpointer，即可自动实现多轮对话记忆与“线程隔离”：

```python
from langgraph.checkpoint.memory import InMemorySaver

memory = InMemorySaver()
graph = graph_builder.compile(checkpointer=memory)

config = {"configurable": {"thread_id": "user-1"}}
events = graph.stream(
    {"messages": [{"role": "user", "content": "你好"}]},
    config,
    stream_mode="values",
)
for event in events:
    print(event["messages"][-1].content)
```

---

### 4. 人类介入（Human-in-the-loop）

需要人工审核时，可在工具实现中使用 `interrupt` 挂起流程，待人工输入后恢复：

```python
from langchain_core.tools import tool
from langgraph.types import interrupt

@tool
def human_assistance(query: str) -> str:
    """请求人工协助"""
    human_response = interrupt({"query": query})
    return human_response["data"]
```

---

### 5. 自定义状态与结构化业务流

State 可任意扩展，实现如实体抽取、审批、上下游任务等复杂业务流：

```python
class State(TypedDict):
    messages: Annotated[list, add_messages]
    name: str
    birthday: str
```

---

### 6. 时间旅行与分支探索

支持任意回溯历史 checkpoint，从任何节点继续新分支探索，非常适合会话复盘与多路径测试：

```python
history = list(graph.get_state_history(config))
checkpoint_config = history[3].config

for event in graph.stream(None, checkpoint_config, stream_mode="values"):
    print(event["messages"][-1].content)
```

---

## 六、常见问题与资源

- [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/)
- [LangSmith 观测与调试平台](https://smith.langchain.com/)
- [LangChain 官方社区](https://github.com/langchain-ai/langchain)

---

## 七、总结与最佳实践

LangGraph 让 AI 工作流编排与多智能体开发变得前所未有地简单和高效。  
**实用建议：**
- 善用 State 结构，充分描述业务全局状态
- 多用工具节点与条件路由，解耦 LLM 与外部世界
- 通过 checkpointer 和 thread_id 管理多用户多会话
- 利用“时间旅行”特性，提升调试和业务分支的可控性
- 结合 LangSmith 做自动化测试与数据追踪

大胆探索，灵活拼搭，打造属于你的下一代智能体！