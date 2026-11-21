# 用 DeepSeek 接入 Breakscale MCP 服务器

Breakscale 的 MCP（Model Context Protocol）服务器让 AI 助手可以为你的代码库建立系统设计模型、跑真实仿真、报告哪里会崩。本指南介绍如何用 DeepSeek 等国产大模型接入它。

MCP 服务器本身不调用任何大模型，它是一个纯工具服务器：**由客户端（桌面应用、IDE 插件、CLI）负责调用 DeepSeek，DeepSeek 决定何时调用 Breakscale 的工具**。所以接入的关键是：选一个既支持 MCP、又能配置 DeepSeek API 的客户端。

> 模型要求：必须选支持函数调用（function calling / tool calls）的模型，如 `deepseek-chat`（V3 系列）。DeepSeek 官方网页聊天目前不能直接连接远程 MCP 服务器；纯推理模型 R1 / reasoner 不支持稳定的工具调用，不要选。

## 两种服务器地址

| 方式      | 地址                                           | 适合                                          |
| --------- | ---------------------------------------------- | --------------------------------------------- |
| 托管服务  | `https://mcp.breakscale.tech/mcp`              | 开箱即用，无需安装（Streamable HTTP，无鉴权） |
| 本地运行  | `npx -y breakscale-mcp --stdio`（需 Node 20+） | 数据不出本机；或客户端只支持 stdio            |
| 本地 HTTP | 本仓库源码启动，`http://127.0.0.1:3001/mcp`    | 想用本仓库修改版（含中文输出）                |

## 方式一：Cherry Studio（推荐，中文客户端）

1. 设置 → MCP 服务器 → 添加。
2. 类型选 **Streamable HTTP**（远程服务器无需本地 Node 环境）。
3. URL 填 `https://mcp.breakscale.tech/mcp`；或用本地 stdio：命令 `npx`，参数 `-y breakscale-mcp --stdio`。
4. 模型服务商选 DeepSeek，API Key 填你在 [platform.deepseek.com](https://platform.deepseek.com) 申请的密钥，模型选 `deepseek-chat`。
5. 新建对话，试试下面的提示词。

## 方式二：ChatBox

新版本支持远程 MCP：设置 → MCP → 添加服务器，类型 Streamable HTTP，URL 同上；模型服务商选 DeepSeek。

## 方式三：Cline（VS Code 代理）

1. 安装 Cline 扩展，设置模型提供商为 DeepSeek（OpenAI 兼容，`https://api.deepseek.com`）。
2. 侧边栏 MCP Servers 面板 → Remote Servers → 添加：URL `https://mcp.breakscale.tech/mcp`，传输选 **Streamable HTTP**。

## 方式四：Claude Code / Codex CLI + DeepSeek

DeepSeek 提供与 Claude 兼容的端点，可以让编码代理类客户端用 DeepSeek 跑：

```bash
# Claude Code（用 DeepSeek 的 Anthropic 兼容端点作为模型，再添加 MCP 服务器）
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=sk-你的DeepSeek密钥
export ANTHROPIC_MODEL=deepseek-chat
claude mcp add --transport http --scope user breakscale https://mcp.breakscale.tech/mcp
```

其他 MCP 桌面客户端（DeepChat、Msty、TypingMind、5ire 等）同样适用：填 DeepSeek 密钥 + 远程 MCP URL 即可。

## 从本仓库运行（含中文输出）

本仓库的 MCP 服务器支持中文结果：

```bash
cd breakscale/mcp
bun install
bun run build
# stdio 方式（给客户端填这条命令）
BREAKSCALE_LANG=zh npx -y breakscale-mcp --stdio
# 或本地 HTTP 方式
BREAKSCALE_LANG=zh node dist/index.js   # 监听 127.0.0.1:3001/mcp
```

`BREAKSCALE_LANG=zh` 让工具描述与仿真结果以中文返回；客户端调用时也可以在参数里传 `language: "zh"`。

## 值得一试的提示词（中文）

- 读取这个仓库的代码，把它的架构画成 Breakscale 设计。告诉我哪些数字是你猜的。
- 设计一个每秒 2000 请求的短链接服务，告诉我它先在哪里崩。
- 把流量翻倍。哪里先失败？不加服务器的话怎么修？
- 用 break_it 工具找出让这个设计违反“不重复扣款”的最少故障组合。

## 画布联动（MCP Apps）

在支持 MCP Apps 的客户端（claude.ai、Claude Desktop、VS Code Copilot、Cursor、Goose）里，`create_view` 工具会直接打开可交互的实时画布，你在画布上的修改会回传给模型。Cherry Studio / ChatBox / Cline 属于“数值与链接”模式：模型返回测量数字和 breakscale.tech 链接，链接在浏览器里打开完整设计。
