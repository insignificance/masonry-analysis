#!/bin/bash

# Masonry 深度分析文档 - GitHub Pages 一键部署助手
# 使用方法: ./deploy_to_github.sh

set -e  # 遇到错误立即退出

echo "🚀 Masonry 深度分析文档 - GitHub Pages 部署助手"
echo "=================================================="

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查当前目录
CURRENT_DIR=$(basename "$PWD")
if [ "$CURRENT_DIR" != "Masonry深度分析" ]; then
    echo -e "${RED}错误: 请在 Masonry深度分析 目录中运行此脚本${NC}"
    echo "当前目录: $CURRENT_DIR"
    exit 1
fi

echo -e "${GREEN}✅ 当前目录正确: $PWD${NC}"
echo ""

# 步骤 1: 清理临时文件
echo "步骤 1: 清理临时文件..."
find . -name ".DS_Store" -delete 2>/dev/null || true
rm -rf __pycache__/ 2>/dev/null || true
rm -rf html/.DS_Store 2>/dev/null || true
echo -e "${GREEN}✅ 临时文件清理完成${NC}"
echo ""

# 步骤 2: 验证必需文件
echo "步骤 2: 验证必需文件..."

# 检查 GitHub Actions 配置
if [ -f ".github/workflows/pages.yml" ]; then
    echo -e "${GREEN}✅ .github/workflows/pages.yml 存在${NC}"
else
    echo -e "${RED}❌ .github/workflows/pages.yml 不存在${NC}"
    echo "请先创建 GitHub Actions 配置文件"
    exit 1
fi

# 检查 html 目录
if [ -d "html" ]; then
    echo -e "${GREEN}✅ html/ 目录存在${NC}"
else
    echo -e "${RED}❌ html/ 目录不存在${NC}"
    exit 1
fi

# 检查 html/index.html
if [ -f "html/index.html" ]; then
    echo -e "${GREEN}✅ html/index.html 存在${NC}"
else
    echo -e "${RED}❌ html/index.html 不存在${NC}"
    exit 1
fi

# 检查 assets 目录
if [ -d "html/assets" ]; then
    echo -e "${GREEN}✅ html/assets/ 目录存在${NC}"
else
    echo -e "${RED}❌ html/assets/ 目录不存在${NC}"
    exit 1
fi

# 检查 docs 目录
DOC_COUNT=$(find html/docs/ -name "*.html" 2>/dev/null | wc -l)
if [ "$DOC_COUNT" -eq 8 ]; then
    echo -e "${GREEN}✅ html/docs/ 包含 8 个 HTML 文件${NC}"
else
    echo -e "${YELLOW}⚠️  html/docs/ 包含 $DOC_COUNT 个 HTML 文件 (期望 8 个)${NC}"
fi

echo ""

# 步骤 3: 检查 Git 状态
echo "步骤 3: 检查 Git 状态..."

if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"

    # 显示当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    echo "当前分支: $CURRENT_BRANCH"

    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  检测到未提交的更改${NC}"
        echo "建议先提交所有更改"
        git status --short
    else
        echo -e "${GREEN}✅ 所有更改已提交${NC}"
    fi

    # 检查远程仓库
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✅ 远程仓库已配置${NC}"
        git remote -v | head -2
    else
        echo -e "${YELLOW}⚠️  远程仓库未配置${NC}"
        echo "请在 GitHub 创建项目后，运行:"
        echo "  git remote add origin <your-github-repo-url>"
        echo "  git push -u origin main"
    fi
else
    echo -e "${YELLOW}⚠️  当前目录不是 Git 仓库${NC}"
    echo "请运行以下命令初始化:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
fi

echo ""

# 步骤 4: 模拟部署测试
echo "步骤 4: 模拟部署测试..."
echo "创建临时 public 目录并复制文件..."

# 创建临时测试目录
TEST_DIR="/tmp/masonry_deploy_test_$$"
mkdir -p "$TEST_DIR/public"
cp -r html/* "$TEST_DIR/public/"

if [ -d "$TEST_DIR/public" ]; then
    echo -e "${GREEN}✅ 模拟部署成功${NC}"
    echo "测试目录: $TEST_DIR/public"
    echo "文件数量: $(find "$TEST_DIR/public" -type f | wc -l)"

    # 清理测试目录
    rm -rf "$TEST_DIR"
    echo -e "${GREEN}✅ 测试目录已清理${NC}"
else
    echo -e "${RED}❌ 模拟部署失败${NC}"
    exit 1
fi

echo ""

# 步骤 5: 检查 GitHub Pages 特殊要求
echo "步骤 5: 检查 GitHub Pages 特殊要求..."

# 检查 CNAME 文件（如果使用自定义域名）
if [ -f "html/CNAME" ]; then
    echo -e "${GREEN}✅ CNAME 文件存在 (自定义域名)${NC}"
    echo "域名: $(cat html/CNAME)"
fi

# 检查 _config.yml (Jekyll 配置，可选)
if [ -f "_config.yml" ]; then
    echo -e "${GREEN}✅ _config.yml 存在${NC}"
else
    echo -e "${YELLOW}⚠️  未找到 _config.yml (可选)${NC}"
fi

echo ""

# 步骤 6: 生成部署指令
echo "步骤 6: 生成部署指令..."
echo ""
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  部署准备完成！${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo "接下来的步骤："
echo ""
echo "1️⃣  在 GitHub 创建项目"
echo "   - 访问: https://github.com/new"
echo "   - 项目名称: masonry-analysis"
echo "   - 可见性: Public (必须)"
echo ""
echo "2️⃣  配置远程仓库"
echo "   git remote add origin https://github.com/your-username/masonry-analysis.git"
echo ""
echo "3️⃣  提交并推送"
echo "   git add ."
echo "   git commit -m '🚀 Initial commit: Masonry 深度分析文档'"
echo "   git push -u origin main"
echo ""
echo "4️⃣  等待部署"
echo "   - 访问 GitHub 仓库页面"
echo "   - 点击 Actions 标签页"
echo "   - 等待 'Deploy GitHub Pages' 完成 (绿色)"
echo ""
echo "5️⃣  访问文档"
echo "   URL: https://your-username.github.io/masonry-analysis/"
echo ""
echo "详细说明请查看: GITHUB_PAGES_DEPLOY.md"
echo ""

# 询问是否查看详细说明
read -p "是否现在查看详细部署说明? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v cat &> /dev/null; then
        cat GITHUB_PAGES_DEPLOY.md
    else
        echo "无法显示文件，请手动打开: GITHUB_PAGES_DEPLOY.md"
    fi
fi

echo ""
echo -e "${GREEN}🎉 祝部署顺利！${NC}"