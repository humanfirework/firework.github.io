// 自定义图片加载动画控制
(function() {
    'use strict';
    
    // 加载动画配置 - 使用配置文件中的设置
    const LOADING_CONFIG = {
        // 使用配置文件中的主加载图片
        imageSrc: LOADING_IMAGES.primary, // 现在是 '/img/custom-loading.gif'
        // 使用配置文件中的备用图片
        fallbackImage: LOADING_IMAGES.fallback, // 现在是 '/img/custom-loading2.gif'
        // 使用配置文件中的加载文字
        loadingText: LOADING_IMAGES.text, // 现在是 '正在加载中'
        // 使用配置文件中的持续时间
        minDuration: LOADING_IMAGES.duration // 现在是 1500ms
    };
    
    // 创建加载动画HTML
    function createPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader-custom';
        
        // 创建加载容器
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.className = 'loading-image';
        img.src = LOADING_CONFIG.imageSrc;
        img.alt = 'Loading';
        
        // 图片加载错误处理
        img.onerror = function() {
            console.log('加载图片失败，使用备用图片');
            this.src = LOADING_CONFIG.fallbackImage;
            
            // 如果备用图片也失败，使用CSS动画
            this.onerror = function() {
                console.log('备用图片也失败，使用CSS加载动画');
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                
                // 替换图片为CSS动画
                if (this.parentNode) {
                    this.parentNode.replaceChild(spinner, this);
                }
            };
        };
        
        // 创建加载文字
        const text = document.createElement('div');
        text.className = 'loading-text';
        text.innerHTML = `${LOADING_CONFIG.loadingText}<span class="loading-dots"></span>`;
        
        // 组装元素
        loadingContainer.appendChild(img);
        loadingContainer.appendChild(text);
        preloader.appendChild(loadingContainer);
        
        document.body.appendChild(preloader);
        return preloader;
    }
    
    // 隐藏加载动画
    function hidePreloader(preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 1000); // 至少显示1秒
    }
    
    // 页面加载完成后隐藏动画
    document.addEventListener('DOMContentLoaded', function() {
        const preloader = createPreloader();
        
        // 等待所有资源加载完成
        window.addEventListener('load', function() {
            hidePreloader(preloader);
        });
        
        // 如果3秒后页面还没加载完，也隐藏动画
        setTimeout(() => {
            hidePreloader(preloader);
        }, 3000);
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 添加页面过渡效果
    document.addEventListener('pjax:send', function() {
        const preloader = createPreloader();
    });
    
    document.addEventListener('pjax:complete', function() {
        const preloader = document.querySelector('.preloader-taiji');
        if (preloader) {
            hidePreloader(preloader);
        }
    });
    
    // 打字机效果
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // 为标题添加打字机效果
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle && siteTitle.textContent) {
        const originalText = siteTitle.textContent;
        typeWriter(siteTitle, originalText, 150);
    }
    
    // 鼠标跟随效果
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 创建鼠标点击效果
    document.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(255, 82, 82, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
})();