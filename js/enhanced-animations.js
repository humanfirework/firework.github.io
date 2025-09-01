/**
 * 🔥 增强版动画效果控制器
 * 让网站更流畅美观的动画系统
 */

(function() {
    'use strict';

    // 动画控制器
    const AnimationController = {
        
        // 初始化所有动画
        init() {
            this.initScrollAnimations();
            this.initNavbarScroll();
            this.initLazyLoading();
            this.initParticles();
            this.initScrollProgress();
            this.initCardAnimations();
            this.initHoverEffects();
        },

        // 1. 滚动视差动画 - 优化版
        initScrollAnimations() {
            const parallaxElements = document.querySelectorAll('.parallax-bg');
            
            if (parallaxElements.length === 0) return;

            let ticking = false;
            const updateParallax = () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                parallaxElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px) translateZ(0)`;
                });
                
                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestTick, { passive: true });
        },

        // 2. 导航栏滚动效果 - 优化版
        initNavbarScroll() {
            const navbar = document.querySelector('#nav, .navbar-scroll');
            if (!navbar) return;

            let lastScrollTop = 0;
            let isScrollingDown = false;
            let ticking = false;
            
            const updateNavbar = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // 修复：向上滚动时显示导航栏，向下滚动时隐藏
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // 向下滚动 - 隐藏导航栏
                    isScrollingDown = true;
                    navbar.style.transform = 'translateY(-100%)';
                    navbar.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                } else if (scrollTop < lastScrollTop) {
                    // 向上滚动 - 显示导航栏
                    isScrollingDown = false;
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            };

            // 使用防抖优化滚动性能
            const debouncedUpdate = debounce(requestTick, 16);
            window.addEventListener('scroll', debouncedUpdate, { passive: true });
        },

        // 3. 图片懒加载
        initLazyLoading() {
            const images = document.querySelectorAll('img[data-src], .img-lazy');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            }
                            
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // 降级处理
                images.forEach(img => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                });
            }
        },

        // 4. 粒子背景效果
        initParticles() {
            const container = document.querySelector('.particles-container');
            if (!container) return;

            const createParticle = () => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 9000);
            };

            // 定期创建粒子
            setInterval(createParticle, 800);
        },

        // 5. 滚动进度条 - 优化版
        initScrollProgress() {
            const progressBar = document.querySelector('.scroll-progress');
            if (!progressBar) return;

            let ticking = false;
            const updateProgress = () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
                progressBar.style.transition = 'width 0.1s cubic-bezier(0.16, 1, 0.3, 1)';
                
                ticking = false;
            };

            const requestTick = () => {
                if (!ticking) {
                    requestAnimationFrame(updateProgress);
                    ticking = true;
                }
            };

            window.addEventListener('scroll', requestTick, { passive: true });
            updateProgress(); // 初始化
        },

        // 6. 卡片动画
        initCardAnimations() {
            const cards = document.querySelectorAll('.card-3d, .flip-card');
            
            if ('IntersectionObserver' in window) {
                const cardObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            cardObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                cards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = 'all 0.6s ease-out';
                    cardObserver.observe(card);
                });
            }
        },

        // 7. 悬停效果增强
        initHoverEffects() {
            // 为所有链接添加波纹效果
            const links = document.querySelectorAll('a, .btn');
            links.forEach(link => {
                if (!link.classList.contains('no-ripple')) {
                    link.classList.add('ripple');
                }
            });

            // 为图标添加旋转效果
            const icons = document.querySelectorAll('.icon, .fa, .icon-spin');
            icons.forEach(icon => {
                icon.classList.add('icon-spin');
            });
        },

        // 8. 打字机效果
        initTypewriter() {
            const typewriterElements = document.querySelectorAll('.typewriter');
            
            typewriterElements.forEach(element => {
                const text = element.textContent;
                element.textContent = '';
                
                let index = 0;
                const typeText = () => {
                    if (index < text.length) {
                        element.textContent += text.charAt(index);
                        index++;
                        setTimeout(typeText, 100);
                    }
                };
                
                // 当元素进入视野时开始打字
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                typeText();
                                observer.unobserve(entry.target);
                            }
                        });
                    });
                    observer.observe(element);
                } else {
                    typeText();
                }
            });
        }
    };

    // 性能优化：防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 初始化动画系统
    document.addEventListener('DOMContentLoaded', () => {
        AnimationController.init();
        
        // 添加页面加载完成动画
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 1000);
    });

    // 添加平滑滚动
    document.documentElement.style.scrollBehavior = 'smooth';

    // 暴露全局方法
    window.AnimationController = AnimationController;

})();