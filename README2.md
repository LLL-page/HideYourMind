# 🎭 虚行真意 (True Intent)

> 一款基于 AI 的意图推理游戏 | An AI-powered intent deduction game

[中文](#中文) | [English](#english)

---

## 中文

### 📖 简介

**虚行真意**是一款独特的网页推理游戏。你设定一个隐藏的"真实意图"，然后通过行动和对话与 AI 控制的 NPC 互动。与此同时，AI 侦探会通过观察你的行为来推理你的真实意图——你需要在达成目标的同时，尽可能误导侦探！

### ✨ 特性

- 🤖 **三大 AI 角色**
  - 系统 AI：担任游戏主持人（GM），生成叙事和 NPC 对话
  - 侦探 AI：观察你的行为，推理你的真实意图
  - 裁判 AI：语义判定，确保侦探的猜测准确

- 🎮 **丰富的游戏体验**
  - 6 个精心设计的场景（小镇、太空船、酒馆、办公室、荒岛、图书馆）
  - 双输入模式：行动 & 对话
  - 多种结局：侦探获胜 / 玩家获胜 / 平局

- 🌍 **国际化支持**
  - 完整的中英文双语界面
  - 一键切换语言

- ⚙️ **灵活配置**
  - 支持任何 OpenAI 兼容 API（OpenAI、DeepSeek、本地模型等）
  - 纯前端实现，无需后端服务器

### 🚀 快速开始

#### 方式一：直接打开

1. 下载或克隆本仓库
2. 直接用浏览器打开 `index.html`（建议使用现代浏览器）

#### 方式二：使用本地服务器（推荐）

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# 然后访问 http://localhost:8080
```

### 🎯 如何游玩

1. **配置 API**：填写你的 OpenAI 兼容 API 信息（Base URL、API Key、模型名称）
2. **设定意图**：选择动机方向 → 输入具体目标 → 选择游戏场景
3. **开始游戏**：通过"行动"和"对话"与 NPC 互动，推进剧情
4. **误导侦探**：AI 侦探会观察你的行为并提问，巧妙回应以隐藏真实意图
5. **达成目标**：在侦探猜中之前完成你的目标，或者成功误导侦探！

### 🎲 结局与计分

| 结局 | 条件 | 得分 |
|------|------|------|
| 🏆 玩家获胜 | 在侦探猜中前完成目标 | 100 分 |
| 🕵️ 侦探获胜 | 侦探正确猜中你的意图 | 最高 60 分（轮数×6） |
| ⚖️ 平局 | 10 轮后双方均未达成 | 30 分 |

### 🛠️ 技术栈

- **前端**：纯 HTML/CSS/JavaScript（无构建工具）
- **样式**：[TailwindCSS](https://tailwindcss.com/) (CDN)
- **AI 接口**：OpenAI 兼容 API 格式

### 📁 项目结构

```
.
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 核心逻辑
├── README.md           # 本文件
└── LICENSE             # CC BY-NC-SA 4.0 许可证
```

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

本项目采用 [CC BY-NC-SA 4.0](LICENSE)（署名-非商业性使用-相同方式共享）许可证。
- ✅ 允许：使用、修改、分发
- ❌ 禁止：商业用途（需获得授权）

---

## English

### 📖 Introduction

**True Intent** is a unique web-based deduction game. You set a hidden "true intent" and interact with AI-controlled NPCs through actions and dialogue. Meanwhile, an AI Detective observes your behavior to deduce your real intent—you need to achieve your goal while misleading the detective!

### ✨ Features

- 🤖 **Three AI Roles**
  - System AI: Acts as Game Master (GM), generating narratives and NPC dialogue
  - Detective AI: Observes your behavior and deduces your true intent
  - Judge AI: Semantic evaluation to ensure detective's guesses are accurate

- 🎮 **Rich Gameplay**
  - 6 carefully designed scenes (cabin, spaceship, tavern, office, island, library)
  - Dual input modes: Action & Dialogue
  - Multiple endings: Detective wins / Player wins / Draw

- 🌍 **Internationalization**
  - Full Chinese and English bilingual interface
  - One-click language switching

- ⚙️ **Flexible Configuration**
  - Supports any OpenAI-compatible API (OpenAI, DeepSeek, local models, etc.)
  - Pure frontend, no backend server required

### 🚀 Quick Start

#### Option 1: Direct Open

1. Download or clone this repository
2. Open `index.html` directly in your browser (modern browser recommended)

#### Option 2: Local Server (Recommended)

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# Then visit http://localhost:8080
```

### 🎯 How to Play

1. **Configure API**: Enter your OpenAI-compatible API info (Base URL, API Key, Model name)
2. **Set Intent**: Choose motive category → Enter specific goal → Pick a scene
3. **Start Game**: Interact with NPCs through "Action" and "Dialogue" to progress
4. **Mislead Detective**: The AI Detective will observe and question you—respond cleverly to hide your intent
5. **Achieve Goal**: Complete your goal before the detective figures it out, or successfully mislead them!

### 🎲 Endings & Scoring

| Ending | Condition | Score |
|--------|-----------|-------|
| 🏆 Player Wins | Complete goal before detective guesses | 100 pts |
| 🕵️ Detective Wins | Detective correctly guesses your intent | Up to 60 pts (rounds × 6) |
| ⚖️ Draw | Neither side achieves goal in 10 rounds | 30 pts |

### 🛠️ Tech Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no build tools)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) (CDN)
- **AI Interface**: OpenAI-compatible API format

### 🤝 Contributing

Issues and Pull Requests are welcome!

### 📄 License

This project is licensed under [CC BY-NC-SA 4.0](LICENSE) (Attribution-NonCommercial-ShareAlike).
- ✅ Allowed: Use, modify, distribute
- ❌ Prohibited: Commercial use (requires authorization)

---

Made with ❤️ by [Your Name]
