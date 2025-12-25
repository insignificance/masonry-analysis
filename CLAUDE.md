# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 **Masonry 深度分析文档项目**，包含 8 个详细章节的技术文档，涵盖 Masonry（iOS/macOS Auto Layout 框架）的架构设计、核心组件、设计模式、源码解析等内容。

**项目类型**: 技术文档项目（Markdown + HTML）
**主要语言**: Markdown, Python, Shell, HTML/CSS/JavaScript
**文档规模**: 8 个章节，约 30,000 字，20+ Mermaid 图表，100+ 代码示例

## 目录结构

```
Masonry深度分析/
├── markdown/              # Markdown 源文件（8个章节）
│   ├── 01_架构概览.md
│   ├── 02_核心组件详解.md
│   ├── 03_设计模式分析.md
│   ├── 04_生命周期流程.md
│   ├── 05_API使用指南.md
│   ├── 06_最佳实践.md
│   ├── 07_源码深度解析.md
│   └── 08_生态分析.md
├── html/                  # HTML 部署版本
│   ├── index.html        # 主入口页面
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/
│   │       ├── navigation.js
│   │       └── mermaid.min.js
│   └── docs/             # 转换后的 HTML 章节
├── convert_docs.py       # Markdown 转 HTML 转换脚本
├── start_server.sh       # 本地服务器启动脚本
├── README.md             # 项目总览
├── QUICK_REFERENCE.md    # 快速参考手册
├── DEPLOYMENT.md         # 部署指南
└── PROJECT_SUMMARY.md    # 项目统计
```

## 核心架构

### 1. 文档层次结构

文档按照学习路径组织，分为 4 个阶段：
- **架构篇** (01-02): 建立整体认知
- **设计篇** (03): 学习设计思想
- **实现篇** (04, 07): 掌握完整流程和源码
- **实践篇** (05-06): 实际应用和优化
- **扩展篇** (08): 了解生态

### 2. 转换流程

Markdown → Python 转换脚本 → HTML → 本地预览/部署

关键转换逻辑：
- 保护代码块（Mermaid、Objective-C、普通代码）
- 转换 Markdown 语法（标题、列表、表格、链接等）
- 恢复代码块并包装为 HTML
- 应用统一模板（导航、目录、样式）

### 3. 部署架构

支持三种部署方式：
- **本地预览**: Python/Node.js/PHP HTTP 服务器
- **GitLab Pages**: 通过 CI/CD 自动部署
- **GitHub Pages**: 通过 Actions 或 gh-pages 分支

## 常用命令

### 本地预览

```bash
# 方式 1: 使用启动脚本（推荐）
./start_server.sh
# 选择 1 (Python 3) 或 2 (Node.js) 或 3 (PHP)

# 方式 2: 直接使用 Python
cd html
python3 -m http.server 8000
# 访问 http://localhost:8000

# 方式 3: 使用 Node.js
cd html
npx http-server -p 8000

# 方式 4: 使用 PHP
cd html
php -S localhost:8000
```

### Markdown 转 HTML

```bash
# 转换所有 Markdown 文件为 HTML
python3 convert_docs.py

# 转换完成后，HTML 文件会生成在 html/docs/ 目录
```

### 文档验证

```bash
# 检查 Markdown 文件是否存在
ls -la markdown/*.md

# 检查 HTML 文件是否生成
ls -la html/docs/*.html

# 验证 Mermaid 图表语法
grep -r "```mermaid" markdown/

# 检查代码块
grep -r "```objective-c" markdown/
```

### 快速查找

```bash
# 搜索特定 API
grep -r "makeConstraints" markdown/

# 搜索设计模式
grep -r "工厂模式\|建造者模式" markdown/

# 查找所有图表
grep -r "```mermaid" markdown/ | wc -l

# 统计文档字数
wc -w markdown/*.md
```

## 文档编辑规范

### Markdown 文件结构

每个章节文档遵循统一结构：

```markdown
# 章节标题

## 主要部分 1
### 子部分 1.1
### 子部分 1.2

## 主要部分 2
### 子部分 2.1

## 总结
```

### 代码块格式

```markdown
# Objective-C 代码
\`\`\`objective-c
[view mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(superview);
}];
\`\`\`

# Mermaid 图表
\`\`\`mermaid
graph TD
    A[开始] --> B[结束]
\`\`\`

# 普通代码
\`\`\`bash
python3 convert_docs.py
\`\`\`
```

### 图表使用指南

项目中使用的 Mermaid 图表类型：
- **flowchart/graph**: 流程图、架构图
- **classDiagram**: 类关系图
- **sequenceDiagram**: 时序图
- **stateDiagram**: 状态图
- **mindmap**: 思维导图
- **timeline**: 时间线
- **pie**: 饼图

## 转换脚本工作原理

### convert_docs.py 核心逻辑

转换脚本 `convert_docs.py` 的处理流程：

1. **保护代码块**: 使用占位符保护 Mermaid 和代码块，避免被后续处理影响
2. **转换 Markdown 语法**: 标题、列表、表格、粗体、斜体、链接等
3. **处理段落**: 将连续文本包裹在 `<p>` 标签中
4. **恢复代码块**: 将占位符替换为正确的 HTML 结构
5. **应用模板**: 使用统一的 HTML 模板，包含导航和样式

### 关键转换规则

```python
# Mermaid 图表
```mermaid → <div class="mermaid">

# Objective-C 代码
```objective-c → <div class="code-block"><pre><code class="language-objective-c">

# 普通代码
``` → <div class="code-block"><pre><code>
```

### 修改转换脚本

如果需要修改转换逻辑：

1. 编辑 `convert_docs.py`
2. 修改 `convert_markdown_to_html()` 函数
3. 运行 `python3 convert_docs.py` 重新生成 HTML
4. 在浏览器中验证结果

## HTML 部署版本

### 文件组织

```
html/
├── index.html              # 主入口，包含所有章节卡片
├── assets/
│   ├── css/style.css      # 统一样式
│   └── js/
│       ├── navigation.js  # 导航和目录生成
│       └── mermaid.min.js # Mermaid 图表库
└── docs/                   # 各章节 HTML
    ├── 01_架构概览.html
    ├── 02_核心组件详解.html
    └── ...
```

### 关键功能

1. **悬浮目录**: 自动从 h2/h3 标签生成，支持点击跳转
2. **滚动监听**: 滚动时自动高亮当前章节
3. **响应式设计**: 适配桌面、平板、手机
4. **Mermaid 渲染**: 自动渲染所有 Mermaid 图表
5. **快捷键支持**: Ctrl+K 切换目录，Ctrl+↑ 回到顶部

## 常见开发任务

### 添加新章节

1. 在 `markdown/` 目录创建新的 `.md` 文件
2. 按照现有章节的结构编写内容
3. 编辑 `convert_docs.py`，在 `files` 列表中添加新文件
4. 运行转换脚本生成 HTML
5. 编辑 `html/index.html`，添加新章节的卡片链接

### 修改样式

编辑 `html/assets/css/style.css`：

```css
/* 主题颜色 */
:root {
    --primary-color: #2c3e50;
    --accent-color: #3498db;
}

/* 修改代码块样式 */
.code-block {
    background: #f5f5f5;
    border-radius: 8px;
}
```

### 更新 Mermaid 配置

编辑 `html/assets/js/navigation.js` 或各章节 HTML 中的初始化代码：

```javascript
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',  // 可选: default, dark, forest, neutral
    securityLevel: 'loose'
});
```

### 修复 Mermaid 图表问题

如果图表不显示：

```bash
# 检查 Mermaid 库是否存在
ls -la html/assets/js/mermaid.min.js

# 重新下载（如果缺失）
cd html/assets/js/
curl -o mermaid.min.js https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js
```

## 部署流程

### GitLab Pages 部署

1. 创建 `.gitlab-ci.yml` 文件：

```yaml
pages:
  stage: deploy
  script:
    - mkdir -p public
    - cp -r html/* public/
  artifacts:
    paths:
      - public
  only:
    - main
```

2. 推送到 GitLab 仓库
3. 等待 CI/CD Pipeline 完成
4. 访问 `https://your-username.gitlab.io/your-repository/`

### GitHub Pages 部署

使用 GitHub Actions 自动部署：

```yaml
# .github/workflows/pages.yml
name: Deploy GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './html'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v2
```

## 故障排查

### 问题 1: 本地服务器无法启动

**症状**: 运行 `./start_server.sh` 后报错

**解决方案**:
```bash
# 检查脚本权限
chmod +x start_server.sh

# 检查 Python 是否安装
python3 --version

# 手动启动
cd html && python3 -m http.server 8000
```

### 问题 2: Mermaid 图表不显示

**症状**: HTML 页面中图表区域为空白

**解决方案**:
```bash
# 检查浏览器控制台是否有错误
# 按 F12 打开开发者工具

# 检查 Mermaid 库是否加载
ls -la html/assets/js/mermaid.min.js

# 检查网络连接（如果使用 CDN）
curl -I https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js
```

### 问题 3: 转换脚本报错

**症状**: 运行 `python3 convert_docs.py` 时出错

**解决方案**:
```bash
# 检查 Python 版本（需要 3.6+）
python3 --version

# 检查 Markdown 文件是否存在
ls -la markdown/*.md

# 检查输出目录权限
ls -ld html/docs/

# 手动创建输出目录
mkdir -p html/docs
```

### 问题 4: 样式不生效

**症状**: HTML 页面显示但样式混乱

**解决方案**:
```bash
# 检查 CSS 文件是否存在
ls -la html/assets/css/style.css

# 清除浏览器缓存
# Chrome/Firefox: Ctrl+Shift+R (强制刷新)

# 检查文件路径是否正确
grep -r "style.css" html/docs/*.html
```

## 项目特点

### 文档质量

- **全面性**: 8 个章节覆盖 Masonry 所有核心内容
- **可视化**: 20+ Mermaid 图表，包括架构图、流程图、时序图等
- **实用性**: 100+ 实际代码示例，可直接复制使用
- **深度**: 从 API 使用到源码解析，多层次分析

### 技术栈

- **文档**: Markdown (源文件)
- **转换**: Python 3 (自定义转换脚本)
- **前端**: HTML5 + CSS3 + JavaScript
- **图表**: Mermaid.js
- **部署**: GitLab Pages / GitHub Pages
- **服务器**: Python HTTP Server / Node.js / PHP

### 设计理念

- **学习路径清晰**: 从入门到精通的渐进式学习
- **理论实践结合**: 每个概念都配有代码示例
- **可视化优先**: 复杂概念用图表展示
- **易于部署**: 支持多种部署方式

## 快速参考

### 文档章节索引

| 章节 | 文件名 | 主要内容 | 阅读时长 |
|------|--------|----------|----------|
| 01 | 架构概览.md | 整体架构、核心组件关系 | 30分钟 |
| 02 | 核心组件详解.md | MASConstraintMaker、MASConstraint 等 | 60分钟 |
| 03 | 设计模式分析.md | 6种设计模式应用 | 40分钟 |
| 04 | 生命周期流程.md | 约束创建、更新、销毁流程 | 45分钟 |
| 05 | API使用指南.md | 所有API和使用场景 | 50分钟 |
| 06 | 最佳实践.md | 性能优化、调试技巧 | 45分钟 |
| 07 | 源码深度解析.md | 逐行源码分析 | 60分钟 |
| 08 | 生态分析.md | 竞品对比、技术选型 | 30分钟 |

### 关键文件说明

- **README.md**: 项目总览和学习路径
- **QUICK_REFERENCE.md**: API 速查手册，包含常见场景模板
- **DEPLOYMENT.md**: 详细的部署指南
- **PROJECT_SUMMARY.md**: 项目统计和完成情况
- **START_HERE.md**: 快速开始指南

## 注意事项

### 编辑文档时

1. **保持一致性**: 遵循现有章节的结构和格式
2. **代码块标记**: 使用正确的语言标记（objective-c, bash, python 等）
3. **Mermaid 语法**: 确保图表语法正确，可在 mermaid.live 验证
4. **中文注释**: 代码注释和说明使用中文（遵循用户的 CLAUDE.md 规范）

### 转换 HTML 后

1. **验证图表**: 在浏览器中检查所有 Mermaid 图表是否正确渲染
2. **检查链接**: 确保所有内部链接和外部链接可用
3. **测试响应式**: 在不同设备尺寸下测试布局
4. **清除缓存**: 使用 Ctrl+Shift+R 强制刷新浏览器

### 部署前

1. **完整测试**: 在本地完整浏览所有章节
2. **检查文件**: 确保所有必需文件都已提交
3. **验证路径**: 确认所有资源路径正确（相对路径）
4. **测试 CI**: 检查 CI/CD 配置文件语法

## 相关资源

### 外部链接

- **Masonry GitHub**: https://github.com/SnapKit/Masonry
- **Apple Auto Layout 文档**: https://developer.apple.com/documentation/uikit/auto_layout
- **Mermaid 文档**: https://mermaid.js.org/
- **Mermaid Live Editor**: https://mermaid.live/

### 学习路径建议

**快速入门** (1小时):
```
README.md → 01_架构概览.md → 05_API使用指南.md
```

**系统学习** (4-6小时):
```
按顺序阅读所有 8 个章节
```

**深度研究** (配合源码):
```
07_源码深度解析.md + Masonry GitHub 源码
```

---

**文档版本**: v1.0
**最后更新**: 2024-12-23
**项目状态**: 已完成
**适用对象**: iOS/macOS 开发者
