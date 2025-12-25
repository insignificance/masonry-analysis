/**
 * Masonry 深度分析 - 导航和交互脚本
 */

class DocumentationNavigator {
    constructor() {
        this.toc = document.getElementById('floating-toc');
        this.tocContent = document.getElementById('toc-content');
        this.contentArea = document.querySelector('.content-area');
        this.toolbar = document.querySelector('.toolbar');

        this.isTOCVisible = true;
        this.init();
    }

    init() {
        console.log('📚 Masonry 深度分析文档导航已初始化');

        this.generateTOC();
        this.setupScrollSpy();
        this.setupMermaid();
        this.setupSmoothScroll();
        this.setupKeyboardShortcuts();

        // 页面加载完成后的动画
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 500);
    }

    // 生成悬浮目录
    generateTOC() {
        if (!this.tocContent) return;

        const headings = document.querySelectorAll('h1, h2, h3');
        if (headings.length === 0) {
            this.tocContent.innerHTML = '<p style="padding: 10px; color: #999;">暂无目录</p>';
            return;
        }

        let tocHTML = '<ul>';
        let currentLevel = 1;
        let openUlCount = 0;

        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            const level = parseInt(heading.tagName[1]);
            const text = heading.textContent;

            // 处理层级缩进
            if (level > currentLevel) {
                tocHTML += '<ul>';
                openUlCount++;
            } else if (level < currentLevel) {
                tocHTML += '</ul>';
                openUlCount--;
            }

            const indent = (level - 1) * 15;
            const icon = this.getHeadingIcon(level);

            tocHTML += `
                <li style="padding-left: ${indent}px; margin: 4px 0;">
                    <a href="#${id}" class="toc-link" data-level="${level}" title="${text}">
                        ${icon} ${text}
                    </a>
                </li>
            `;

            currentLevel = level;
        });

        // 关闭所有未关闭的ul
        while (openUlCount > 0) {
            tocHTML += '</ul>';
            openUlCount--;
        }

        tocHTML += '</ul>';
        this.tocContent.innerHTML = tocHTML;

        // 为目录链接添加点击事件
        this.tocContent.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    this.scrollToElement(target);
                    this.hideTOC(); // 移动端自动隐藏
                }
            });
        });

        console.log(`✅ 生成了 ${headings.length} 个目录项`);
    }

    // 获取标题图标
    getHeadingIcon(level) {
        const icons = {
            1: '📖',
            2: '📌',
            3: '🔹',
            4: '🔸'
        };
        return icons[level] || '•';
    }

    // 滚动监听高亮
    setupScrollSpy() {
        const headings = document.querySelectorAll('h1, h2, h3');
        if (headings.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 移除所有active
                    document.querySelectorAll('.toc-link').forEach(link => {
                        link.classList.remove('active');
                    });

                    // 激活当前
                    const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');

                        // 自动滚动目录到可见区域
                        if (this.toc) {
                            const tocRect = this.toc.getBoundingClientRect();
                            const linkRect = activeLink.getBoundingClientRect();

                            if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
                                activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }
                    }
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0.1
        });

        headings.forEach(h => observer.observe(h));
    }

    // Mermaid 初始化和渲染
    setupMermaid() {
        if (typeof mermaid !== 'undefined') {
            try {
                mermaid.initialize({
                    startOnLoad: false,  // 改为 false，手动初始化
                    theme: 'default',
                    securityLevel: 'loose',
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true,
                        curve: 'basis'
                    },
                    sequence: {
                        useMaxWidth: true
                    },
                    gantt: {
                        axisFormat: '%Y-%m-%d'
                    }
                });

                // 延迟渲染，确保DOM准备就绪
                setTimeout(() => {
                    const mermaidElements = document.querySelectorAll('.mermaid');
                    if (mermaidElements.length > 0) {
                        mermaid.init(undefined, mermaidElements);
                        console.log(`✅ Mermaid 图表渲染完成，共 ${mermaidElements.length} 个图表`);
                    } else {
                        console.log('ℹ️ 页面中没有 Mermaid 图表');
                    }
                }, 200);

            } catch (error) {
                console.warn('Mermaid 渲染失败:', error);
            }
        } else {
            console.warn('⚠️ Mermaid 库未加载');
        }
    }

    // 平滑滚动
    setupSmoothScroll() {
        // 为所有内部链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.length > 1) { // 不是空链接
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        this.scrollToElement(target);
                    }
                }
            });
        });
    }

    // 滚动到元素
    scrollToElement(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // URL更新（可选）
        history.pushState(null, null, `#${element.id}`);
    }

    // 键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: 切换目录
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleTOC();
            }

            // Ctrl/Cmd + Up: 滚动到顶部
            if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollToTop();
            }

            // Ctrl/Cmd + Home: 返回首页
            if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
                e.preventDefault();
                this.backToIndex();
            }

            // Ctrl/Cmd + /: 显示快捷键帮助
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardHelp();
            }
        });
    }

    // 工具栏功能
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showNotification('已滚动到顶部', 'success');
    }

    toggleTOC() {
        if (!this.toc) return;

        this.isTOCVisible = !this.isTOCVisible;

        if (this.isTOCVisible) {
            this.toc.classList.remove('hidden');
            this.showNotification('目录已显示', 'success');
        } else {
            this.toc.classList.add('hidden');
            this.showNotification('目录已隐藏', 'info');
        }
    }

    hideTOC() {
        if (window.innerWidth <= 768 && this.toc) {
            this.toc.classList.add('hidden');
            this.isTOCVisible = false;
        }
    }

    backToIndex() {
        // 从 docs/xxx.html 返回到 ../index.html
        window.location.href = '../index.html';
    }

    // 欢迎消息
    showWelcomeMessage() {
        const messages = [
            '🎉 欢迎来到 Masonry 深度分析文档！',
            '💡 提示：使用 Ctrl+K 切换目录',
            '📚 建议按顺序阅读，从架构概览开始',
            '🎯 每个章节都有详细的代码示例和图表',
            '🚀 祝你学习愉快！'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showNotification(randomMessage, 'info', 3000);
    }

    // 键盘快捷键帮助
    showKeyboardHelp() {
        const helpText = `
快捷键帮助：
Ctrl/Cmd + K: 切换目录显示
Ctrl/Cmd + ↑: 滚动到顶部
Ctrl/Cmd + Home: 返回首页
Ctrl/Cmd + /: 显示此帮助
        `;
        alert(helpText);
    }

    // 通知系统
    showNotification(message, type = 'info', duration = 2000) {
        // 移除现有通知
        const existing = document.getElementById('notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        // 添加动画样式
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getNotificationColor(type) {
        const colors = {
            info: '#3498db',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c'
        };
        return colors[type] || colors.info;
    }

    // 响应式处理
    handleResize() {
        if (window.innerWidth > 768) {
            // 桌面端：显示目录
            if (this.toc) {
                this.toc.classList.remove('hidden');
                this.isTOCVisible = true;
            }
        } else {
            // 移动端：隐藏目录
            if (this.toc) {
                this.toc.classList.add('hidden');
                this.isTOCVisible = false;
            }
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 等待Mermaid加载（如果使用CDN）
    const checkMermaid = setInterval(() => {
        if (typeof mermaid !== 'undefined' || document.readyState === 'complete') {
            clearInterval(checkMermaid);
            window.docNav = new DocumentationNavigator();
        }
    }, 100);

    // 响应式处理
    window.addEventListener('resize', () => {
        if (window.docNav) {
            window.docNav.handleResize();
        }
    });

    // 页面可见性变化时重新渲染Mermaid
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && typeof mermaid !== 'undefined') {
            setTimeout(() => {
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
            }, 100);
        }
    });
});

// 全局工具函数（供HTML调用）
window.scrollToTop = function() {
    if (window.docNav) window.docNav.scrollToTop();
};

window.toggleTOC = function() {
    if (window.docNav) window.docNav.toggleTOC();
};

window.backToIndex = function() {
    if (window.docNav) window.docNav.backToIndex();
};

window.showHelp = function() {
    if (window.docNav) window.docNav.showKeyboardHelp();
};