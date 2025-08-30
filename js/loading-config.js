// 加载动画配置文件
// 在这里修改你的自定义加载图片路径
const LOADING_IMAGES = {
    // 主加载图片 - 你可以替换为你想要的任何本地图片
    primary: '/img/custom-loading.gif',
    
    // 备用加载图片
    fallback: '/img/custom-loading2.gif',
    
    // 你还可以添加更多图片选项
    options: [
        '/img/favicon.png',           // 当前favicon
        '/img/apple-touch-icon.png',  // 苹果图标
        '/img/loading-logo.png',      // 你可以添加自己的logo
        '/img/custom-loading.gif',    // 可以添加GIF动画
    ],
    
    // 加载文字
    text: '正在加载中',
    
    // 动画持续时间（毫秒）
    duration: 500
};

// 使用方法：
// 1. 把你想要的图片放到 source/img/ 目录下
// 2. 修改上面的 primary 路径为你图片的路径
// 3. 重新运行 hexo generate && hexo server

// 示例：
// 如果你想用自己的logo.png，只需：
// primary: '/img/logo.png'

// 加载动画控制逻辑
(function() {
    'use strict';

    // 等待页面完全加载后隐藏加载动画
    function hideLoadingAnimation() {
        const preloader = document.querySelector('.preloader-custom');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hide');
                
                // 触发开门动画
                if (typeof triggerDoorAnimation === 'function') {
                    setTimeout(() => {
                        triggerDoorAnimation();
                    }, 300);
                }
            }, LOADING_IMAGES.duration);
        }
    }

    // 当页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideLoadingAnimation);
    } else {
        hideLoadingAnimation();
    }

    // 如果页面已经加载完成，直接执行
    window.addEventListener('load', hideLoadingAnimation);
})();