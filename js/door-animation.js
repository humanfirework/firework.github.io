// 开门动画效果 + 字体从下至上浮现 - 仅首页版本
(function() {
    'use strict';

    let animationTriggered = false;

    // 检查是否为首页
    function isHomePage() {
        // 检查URL路径
        const pathname = window.location.pathname;
        const isRootPath = pathname === '/' || pathname === '/index.html' || pathname.endsWith('/');
        
        // 检查页面特征 - 首页通常有特定元素
        const hasHomeElements = document.querySelector('.recent-post-item') || 
                               document.querySelector('.post-list') ||
                               document.querySelector('#recent-posts');
        
        // 检查是否在文章页面或其他页面
        const isPostPage = document.querySelector('.post-content') || 
                          document.querySelector('.post-title') ||
                          pathname.includes('/archives/') ||
                          pathname.includes('/categories/') ||
                          pathname.includes('/tags/') ||
                          pathname.includes('/about/') ||
                          pathname.includes('/link/');
        
        const result = isRootPath && hasHomeElements && !isPostPage;
        console.log('首页检测:', { pathname, isRootPath, hasHomeElements, isPostPage, result });
        return result;
    }

    // 创建开门元素和欢迎文字
    function createDoorElements() {
        // 检查是否已存在动画元素
        if (document.querySelector('.door-animation-container')) {
            return null;
        }

        // 只在首页显示
        if (!isHomePage()) {
            return null;
        }

        const doorContainer = document.createElement('div');
        doorContainer.className = 'door-animation-container';
        doorContainer.innerHTML = `
            <div class="door-overlay door-left">
                <div class="door-content">欢迎</div>
            </div>
            <div class="door-overlay door-right">
                <div class="door-content">回来</div>
            </div>
            <div class="welcome-text">
                <h1 class="fade-in-up-text">未亡人的博客</h1>
                <p class="fade-in-up-text">欢迎来到我的世界</p>
                <p class="subtitle fade-in-up-text">一起探索无限可能</p>
            </div>
            <!-- 隐藏原始标题，避免重叠 -->
            <style>
                .site-title, .blog-title, header h1, .header-title {
                    opacity: 0 !important;
                    transition: opacity 0.8s ease-in-out;
                }
                .site-title.show-original, .blog-title.show-original, 
                header h1.show-original, .header-title.show-original {
                    opacity: 1 !important;
                }
            </style>
        `;
        document.body.appendChild(doorContainer);
        return doorContainer;
    }

    // 创建浮动文字元素
    // function createFloatingText() {
    //     const textContainer = document.createElement('div');
    //     textContainer.className = 'fade-in-up-container floating-text-container';
    //     textContainer.innerHTML = `
    //         <div class="floating-words">
    //             <span class="fade-in-up-text">探索</span>
    //             <span class="fade-in-up-text">创新</span>
    //             <span class="fade-in-up-text">分享</span>
    //             <span class="fade-in-up-text">成长</span>
    //         </div>
    //     `;
    //     return textContainer;
    // }

    // 清理旧的动画元素
    function cleanupAnimation() {
        const oldContainers = document.querySelectorAll('.door-animation-container, .floating-text-container');
        oldContainers.forEach(container => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
    }

    // 初始化开门动画和文字浮现
    function initDoorAnimation() {
        if (animationTriggered) {
            console.log('动画已触发，跳过重复执行');
            return;
        }

        animationTriggered = true;
        cleanupAnimation();

        const doorContainer = createDoorElements();
        if (!doorContainer) {
            console.log('动画容器已存在或创建失败');
            return;
        }

        const doorLeft = doorContainer.querySelector('.door-left');
        const doorRight = doorContainer.querySelector('.door-right');
        const welcomeText = doorContainer.querySelector('.welcome-text');

        // 确保页面可见
        setTimeout(() => {
            // 触发开门动画
            doorLeft.classList.add('open');
            doorRight.classList.add('open');

            // 开门完成后显示欢迎文字（红字先浮现）
                setTimeout(() => {
                    welcomeText.classList.add('show');
                    
                    // 红字显示一段时间后淡出
                    setTimeout(() => {
                        welcomeText.style.transition = 'opacity 0.8s ease-out';
                        welcomeText.style.opacity = '0';
                        
                        // 红字完全消失后再显示原始标题
                        setTimeout(() => {
                            // 找到原始标题元素并显示
                            const originalTitles = document.querySelectorAll('.site-title, .blog-title, header h1, .header-title');
                            originalTitles.forEach(title => {
                                title.classList.add('show-original');
                            });
                            
                            // 添加浮动文字效果（可选）
                            const floatingText = createFloatingText();
                            floatingText.style.position = 'fixed';
                            floatingText.style.top = '30%';
                            floatingText.style.left = '50%';
                            floatingText.style.transform = 'translate(-50%, -50%)';
                            floatingText.style.zIndex = '9998';
                            document.body.appendChild(floatingText);
                            
                            // 显示浮动文字
                            setTimeout(() => {
                                floatingText.classList.add('show');
                            }, 200);

                            // 最终移除所有动画元素，保留原始标题
                            setTimeout(() => {
                                if (doorContainer.parentNode) {
                                    doorContainer.remove();
                                }
                                if (floatingText.parentNode) {
                                    floatingText.remove();
                                }
                                animationTriggered = false; // 重置状态
                            }, 2000);
                        }, 800); // 等待红字淡出完成
                    }, 2000); // 红字显示2秒后淡出
                }, 800); // 等待开门动画完成
        }, 300); // 更短的延迟
    }

    // 确保只在首次加载时触发
    function safeInit() {
        if (document.querySelector('.door-animation-container')) {
            return;
        }
        
        // 延迟执行，确保页面完全加载
        setTimeout(initDoorAnimation, 100);
    }

    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInit);
    } else {
        safeInit();
    }

    // 导出全局函数，但添加保护
    window.triggerDoorAnimation = function() {
        if (!animationTriggered) {
            initDoorAnimation();
        }
    };

    // 添加页面可见性检测
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !animationTriggered) {
            setTimeout(initDoorAnimation, 100);
        }
    });
})();