# GitHub Pages 部署指南

本指南将帮助你将 Masonry 深度分析文档部署到 GitHub Pages，实现在线访问。

## 📋 部署前检查

### 项目结构验证

确保你的项目结构如下：

```
Masonry深度分析/
├── .github/
│   └── workflows/
│       └── pages.yml          # ✅ GitHub Actions 配置（已创建）
├── html/                      # ✅ HTML 文档目录
│   ├── index.html            # ✅ 主入口
│   ├── assets/
│   │   ├── css/style.css     # ✅ 样式文件
│   │   └── js/
│   │       ├── mermaid.min.js  # ✅ Mermaid 库
│   │       └── navigation.js   # ✅ 导航脚本
│   └── docs/                 # ✅ 8个章节 HTML
│       ├── 01_架构概览.html
│       ├── 02_核心组件详解.html
│       └── ... (共8个)
├── markdown/                  # 源文件（不需要部署）
├── README.md                  # 项目说明
└── 其他文档...
```

### ✅ 必需文件检查

```bash
# 检查 GitHub Actions 配置
ls -la .github/workflows/pages.yml

# 检查 html 目录结构
ls -la html/
ls -la html/assets/css/
ls -la html/assets/js/
ls -la html/docs/

# 验证所有 HTML 文件存在
find html/docs/ -name "*.html" | wc -l  # 应该输出 8
```

## 🚀 部署步骤

### 步骤 1: 初始化 Git 仓库

如果你还没有 Git 仓库：

```bash
# 进入项目目录
cd /Users/egets/Desktop/note/Masonry深度分析

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "🚀 Initial commit: Masonry 深度分析文档项目"
```

### 步骤 2: 创建 GitHub 仓库

1. **登录 GitHub**
   - 访问 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - 填写仓库信息：
     - **Repository name**: `masonry-analysis` 或 `masonry深度分析`
     - **Description**: `Masonry 深度分析文档 - iOS Auto Layout 框架源码解析`
     - **Visibility**: 选择 `Public`（GitHub Pages 需要公开仓库）
     - **Initialize repository with a README**: ❌ 不要勾选（已有 README）

3. **获取仓库 URL**
   - 创建完成后，复制仓库 URL
   - 格式：`https://github.com/your-username/masonry-analysis.git`

### 步骤 3: 推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/masonry-analysis.git

# 推送到 GitHub
git push -u origin main

# 如果你的默认分支是 master
git push -u origin master
```

### 步骤 4: 启用 GitHub Pages

1. **进入仓库设置**
   - 在 GitHub 仓库页面，点击 "Settings"
   - 左侧菜单点击 "Pages"

2. **配置 GitHub Pages**
   - **Source**: 选择 "Deploy from a branch"
   - **Branch**: 选择 `main` 或 `gh-pages`（推荐 `gh-pages`）
   - **Folder**: 选择 `/ (root)` 或 `/docs`（我们使用 Actions，这里可以先跳过）

3. **等待 Actions 运行**
   - 点击 "Actions" 标签页
   - 你会看到 "Deploy GitHub Pages" 工作流正在运行
   - 等待绿色对勾出现（通常 1-2 分钟）

### 步骤 5: 访问部署的页面

Actions 成功后：

1. **自动部署 URL**
   - GitHub 会自动创建 Pages URL
   - 格式：`https://your-username.github.io/masonry-analysis/`

2. **查看 Pages 设置**
   - 在 Settings → Pages 中查看部署状态
   - 你会看到 "Your site is live at ..."

3. **访问文档**
   - 主页面：`https://your-username.github.io/masonry-analysis/`
   - 章节页面：`https://your-username.github.io/masonry-analysis/docs/01_架构概览.html`

## 🔧 配置详解

### .github/workflows/pages.yml 说明

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [ main ]  # 推送到 main 分支时自动部署

jobs:
  build:              # 构建作业
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4      # 检出代码
      - name: 准备部署文件
        run: |
          mkdir -p public
          cp -r html/* public/         # 复制到 public 目录
      - uses: actions/upload-pages-artifact@v3  # 上传产物

  deploy:             # 部署作业
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4  # 部署到 Pages
```

### 可选配置

#### 1. 修改触发分支

如果你的默认分支是 `master`：

```yaml
on:
  push:
    branches: [ master ]
```

#### 2. 添加手动触发

```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:  # 允许手动触发
```

#### 3. 使用 gh-pages 分支

如果你想使用独立的 gh-pages 分支：

```yaml
# 在 Settings → Pages 中选择 gh-pages 分支
# 然后修改工作流：
- name: 推送到 gh-pages
  run: |
    git config --global user.name "GitHub Actions"
    git config --global user.email "actions@github.com"
    git checkout --orphan gh-pages
    git rm -rf .
    cp -r ../public/* .
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push -f origin gh-pages
```

## 🎯 部署后验证

### 1. 检查页面显示

访问部署 URL 后，验证：

- [ ] 主页面正确显示
- [ ] 所有 8 个章节链接可见
- [ ] 点击章节能正常跳转
- [ ] 返回主页链接正常工作

### 2. 验证 Mermaid 图表

- [ ] 打开任意章节（如 01_架构概览）
- [ ] 检查 Mermaid 图表是否正确渲染
- [ ] 如果图表不显示，检查浏览器控制台错误

### 3. 验证样式和脚本

- [ ] 页面样式正确加载
- [ ] 悬浮目录功能正常
- [ ] 导航脚本无错误

### 4. 测试响应式设计

- [ ] 在桌面浏览器中测试
- [ ] 在移动设备中测试
- [ ] 检查不同屏幕尺寸下的显示

## 🐛 常见问题排查

### 问题 1: Actions 失败

**症状**: Actions 显示红色失败状态

**解决方案**:
```bash
# 1. 检查 .github/workflows/pages.yml 语法
cat .github/workflows/pages.yml

# 2. 检查 html 目录是否存在
ls -la html/

# 3. 本地模拟执行
mkdir -p public
cp -r html/* public/
ls -la public/
```

### 问题 2: 页面 404

**症状**: 访问 Pages URL 显示 404

**可能原因**:
- Actions 还未完成（等待几分钟）
- 仓库不是 Public（GitHub Pages 需要公开仓库）
- 分支名称错误

**解决方案**:
- 等待 Actions 完成
- 检查仓库可见性：Settings → General → Visibility
- 确认 Actions 配置的分支名正确

### 问题 3: Mermaid 图表不显示

**症状**: 页面显示但图表区域空白

**原因**: GitHub Pages 可能限制外部 CDN

**解决方案**: 下载 Mermaid 库到本地

```bash
# 下载 Mermaid 库
cd html/assets/js/
curl -o mermaid.min.js https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js

# 更新 HTML 文件中的引用（如果需要）
# 将 CDN 链接改为本地路径
# <script src="assets/js/mermaid.min.js"></script>

# 重新提交
git add html/assets/js/mermaid.min.js
git commit -m "fix: 使用本地 Mermaid 库"
git push
```

### 问题 4: 样式不加载

**症状**: 页面无样式，纯文本显示

**解决方案**:
```bash
# 检查 CSS 文件路径
ls -la html/assets/css/style.css

# 检查 HTML 中的引用
grep "style.css" html/index.html
# 应该显示: <link rel="stylesheet" href="assets/css/style.css">

# 检查 GitHub Pages URL 结构
# 如果 URL 是 https://user.github.io/repo/
# 则 assets/css/style.css 的完整路径是
# https://user.github.io/repo/assets/css/style.css
```

### 问题 5: 权限错误

**症状**: Actions 显示权限错误

**解决方案**:
- 检查 `.github/workflows/pages.yml` 中的 permissions 设置
- 确保有 `contents: read`, `pages: write`, `id-token: write`
- 在 Settings → Actions → General 中检查工作流权限

### 问题 6: 中文文件名问题

**症状**: 链接中的中文文件名无法访问

**解决方案**: GitHub Pages 支持中文 URL，但建议：
- 保持现有文件名（已测试正常）
- 如果有问题，可重命名为英文：
  ```bash
  mv html/docs/01_架构概览.html html/docs/01_architecture_overview.html
  # 并更新所有链接引用
  ```

## 📊 部署状态检查清单

### 部署前检查

- [ ] `.github/workflows/pages.yml` 文件已创建
- [ ] `html/` 目录包含所有必需文件
- [ ] `html/index.html` 存在
- [ ] `html/assets/` 目录完整
- [ ] `html/docs/` 包含 8 个 HTML 文件
- [ ] Git 仓库已初始化
- [ ] GitHub 仓库已创建（Public）

### 部署中检查

- [ ] Actions 成功启动
- [ ] build job 显示绿色通过
- [ ] deploy job 显示绿色通过
- [ ] 日志显示文件复制成功
- [ ] Artifacts 正确生成

### 部署后检查

- [ ] Pages URL 可访问
- [ ] 主页面显示正常
- [ ] 所有章节链接有效
- [ ] Mermaid 图表渲染正常
- [ ] 样式文件加载正常
- [ ] 导航功能正常
- [ ] 响应式设计正常

## 🔄 更新文档流程

### 修改内容后更新

```bash
# 1. 修改 Markdown 源文件（可选）
# 编辑 markdown/ 目录中的文件

# 2. 重新生成 HTML（如果修改了源文件）
python3 convert_docs.py

# 3. 提交更新
git add .
git commit -m "docs: 更新 XX 章节内容"

# 4. 推送到 GitHub
git push

# 5. 等待 Actions 完成
# 访问 GitHub Actions 查看状态

# 6. 验证更新
# 访问 Pages URL 检查更新内容
```

### 直接修改 HTML

```bash
# 1. 直接编辑 html/ 目录中的文件
# 例如: vi html/docs/01_架构概览.html

# 2. 提交修改
git add html/
git commit -m "fix: 修正 01_架构概览中的图表错误"

# 3. 推送并等待部署
git push
```

## 🎓 高级配置

### 1. 使用自定义域名

1. 在 GitHub 仓库 Settings → Pages 中添加自定义域名
2. 配置 DNS 记录（CNAME 或 A 记录）
3. 等待 DNS 生效
4. 在 Pages 设置中验证域名
5. 勾选 "Enforce HTTPS"

### 2. 使用 gh-pages 分支

如果你想保持 main 分支干净，可以使用 gh-pages 分支：

```yaml
# 修改 .github/workflows/pages.yml
- name: 推送到 gh-pages
  run: |
    git config --global user.name "GitHub Actions"
    git config --global user.email "actions@github.com"
    git checkout --orphan gh-pages
    git rm -rf .
    cp -r ../public/* .
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push -f origin gh-pages
```

然后在 Settings → Pages 中选择 gh-pages 分支。

### 3. 添加访问统计

在 `html/index.html` 的 `<head>` 中添加：

```html
<!-- Google Analytics (可选) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 4. 添加 Jekyll 配置（可选）

如果需要，可以在根目录添加 `_config.yml`：

```yaml
title: Masonry 深度分析文档
description: 全面深入的 Masonry 源码分析与使用指南
theme: jekyll-theme-minimal
```

### 5. 预览部署

在推送前本地预览：

```bash
# 进入 html 目录
cd html

# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
# 检查所有功能是否正常
```

## 📞 获取帮助

### GitHub 官方文档

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Pages 故障排查](https://docs.github.com/en/pages/troubleshooting-your-github-pages-site)

### 检查部署状态

```bash
# 查看当前分支
git branch

# 查看最近提交
git log --oneline -5

# 查看远程仓库状态
git remote -v

# 查看 GitHub Actions
# 访问: https://github.com/your-username/masonry-analysis/actions
```

## 📝 部署成功示例

### 成功标志

✅ **Actions 状态**: 绿色通过
✅ **Pages URL**: `https://your-username.github.io/masonry-analysis/`
✅ **访问结果**: 正常显示文档内容
✅ **图表渲染**: Mermaid 图表正常显示
✅ **导航功能**: 悬浮目录和跳转正常

### 示例 URL 结构

```
主页面: https://your-username.github.io/masonry-analysis/
章节 1: https://your-username.github.io/masonry-analysis/docs/01_架构概览.html
章节 2: https://your-username.github.io/masonry-analysis/docs/02_核心组件详解.html
样式表: https://your-username.github.io/masonry-analysis/assets/css/style.css
脚本:   https://your-username.github.io/masonry-analysis/assets/js/navigation.js
```

---

**文档版本**: v1.0
**最后更新**: 2025-12-25
**适用范围**: GitHub.com
**测试状态**: ✅ 已验证路径和配置正确