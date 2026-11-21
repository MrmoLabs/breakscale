# Breakscale（中文说明）

搭建一个系统，加大流量直到把它压垮，看清它为什么垮。

这是 [Breakscale](https://github.com/workersio/breakscale) 的中文说明页。Breakscale 是一个系统设计模拟器：把负载均衡器、缓存、数据库、队列等 33 种组件放到画布上，连成一个系统，然后拖大流量，观察真实的离散事件仿真结果：延迟分位数攀升、队列填满、熔断器跳闸、重试风暴让整个系统雪崩。所有数字都来自对单个模拟请求的测量，而不是画出来"看起来合理"的曲线。

## 三种使用方式

- **浏览器**：打开 [breakscale.tech](https://breakscale.tech)，左侧选一个示例，拖大流量滑块直到出现红色。无需注册。
- **VS Code**：在扩展市场安装 Breakscale，命令面板运行 **Open Breakscale**，离线可用。
- **AI 助手**：把 [MCP 服务器](docs/zh/mcp-deepseek.md)接入 Claude、Cursor、DeepSeek 等助手，让它读你的代码、画出架构、报告哪里会崩。

## 中文界面

本分支在原版基础上增加了简体中文界面：

- 默认跟随浏览器语言，也可以在 **设置 → 语言** 中手动切换（跟随系统 / English / 简体中文）。
- 界面、全部 24 个示例、18 个挑战、6 个真实事故复盘、术语表、学习路径均已汉化。
- 设计文件与分享链接保持原格式：中文界面打开英文分享链接完全兼容，反之亦然。
- MCP 服务器支持中文输出：运行时设置 `BREAKSCALE_LANG=zh`，或调用工具时传 `language: "zh"`。接入 DeepSeek 等模型的完整指南见 [docs/zh/mcp-deepseek.md](docs/zh/mcp-deepseek.md)。

## 本地运行

需要 [Bun](https://bun.sh)：

```bash
git clone https://github.com/workersio/breakscale.git
cd breakscale
bun install
bun dev
```

然后打开 http://localhost:5173。

```
src/sim/         仿真引擎。无 React、无 DOM、无 I/O
src/i18n/        多语言层（本分支新增）
extension/       VS Code 扩展
mcp/             MCP 服务器
worker/          短分享链接背后的 Cloudflare Worker
```

## 许可

[MIT](LICENSE)。`public/fonts/Caveat/` 中的 Caveat 字体单独按 [SIL Open Font License 1.1](public/fonts/Caveat/OFL.txt) 授权。
