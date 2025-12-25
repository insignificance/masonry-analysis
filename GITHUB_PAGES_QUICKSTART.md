# 🚀 GitHub Pages 快速部署指南

**5 分钟完成部署**

---

## ⚡ 一键部署

```bash
# 1. 进入项目目录
cd /Users/egets/Desktop/note/Masonry深度分析

# 2. 初始化 Git (如果未初始化)
git init
git add .
git commit -m "🚀 Initial commit"

# 3. 在 GitHub 创建仓库
# 访问: https://github.com/new
# 填写项目名称，选择 Public

# 4. 配置远程仓库 (替换你的 URL)
git remote add origin https://github.com/your-username/masonry-analysis.git

# 5. 推送代码
git push -u origin main

# 6. 等待 1-2 分钟，访问:
# https://your-username.github.io/masonry-analysis/
```

---

## 📋 完整命令序列

```bash
# 进入项目目录
cd /Users/egets/Desktop/note/Masonry深度分析

# 清理临时文件 (可选)
find . -name ".DS_Store" -delete
rm -rf __pycache__/ 2>/dev/null || true

# 初始化 Git
git init
git add .
git commit -m "🚀 Initial commit: Masonry 深度分析文档"

# 在 GitHub 创建仓库后，配置远程
git remote add origin https://github.com/your-username/masonry-analysis.git

# 推送
git push -u origin main

# 等待 Actions 完成 (1-2 分钟)
# 访问: https://your-username.github.io/masonry-analysis/
```

---

## ✅ 检查清单

- [ ] `.github/workflows/pages.yml` 已创建 ✅
- [ ] `html/` 目录完整 ✅
- [ ] Git 仓库已初始化
- [ ] GitHub 仓库已创建 (Public)
- [ ] 代码已推送
- [ ] Actions 成功
- [ ] 页面可访问

---

## 🔗 重要链接

- **部署说明**: `GITHUB_PAGES_DEPLOY.md`
- **主页面**: `html/index.html`
- **Actions 配置**: `.github/workflows/pages.yml`
- **GitHub 仓库**: https://github.com/your-username/masonry-analysis

---

## 🎯 访问 URL

```
主页面: https://your-username.github.io/masonry-analysis/
章节 1: https://your-username.github.io/masonry-analysis/docs/01_架构概览.html
章节 2: https://your-username.github.io/masonry-analysis/docs/02_核心组件详解.html
...
```

---

## 🐛 常见问题

**Q: 页面显示 404?**
A: 等待 Actions 完成，检查仓库是否为 Public

**Q: Mermaid 图表不显示?**
A: 检查浏览器控制台，可能需要下载 Mermaid 到本地

**Q: Actions 失败?**
A: 检查 `.github/workflows/pages.yml` 语法和 html 目录结构

**Q: 样式丢失?**
A: 检查 assets/css/style.css 路径是否正确

---

## 📞 需要帮助?

查看完整文档: `GITHUB_PAGES_DEPLOY.md`

---

**版本**: v1.0 | **更新**: 2025-12-25