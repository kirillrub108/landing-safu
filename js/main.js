import { loadIncludes } from './includes.js';
import { initThemeToggle } from './theme.js';
import { initNavigation } from './nav.js';
import { initGallerySlider } from './slider.js';
import { initPreloader, initHeroVideo, initEducationTrack, initTabs, initFeaturePreview, initScrollAnimations, initSmoothScroll } from './others.js';

// Глобальная обработка необработанных ошибок
window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
});

// Безопасная инициализация с обработкой ошибок
const safeInit = (fn, name) => {
    try {
        fn();
    } catch (error) {
        console.error(`[Init] Error in ${name}:`, error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[App] DOMContentLoaded - starting initialization');

    // Загружаем HTML секции (с таймаутом и обработкой ошибок внутри)
    try {
        await loadIncludes();
    } catch (error) {
        console.error('[App] Critical error loading includes:', error);
    }

    // Инициализируем все модули с защитой от ошибок
    safeInit(initThemeToggle, 'theme toggle');
    safeInit(initPreloader, 'preloader');
    safeInit(initNavigation, 'navigation');
    safeInit(initHeroVideo, 'hero video');
    safeInit(initEducationTrack, 'education track');
    safeInit(initTabs, 'tabs');
    safeInit(initFeaturePreview, 'feature preview');
    safeInit(initScrollAnimations, 'scroll animations');
    safeInit(initSmoothScroll, 'smooth scroll');
    safeInit(initGallerySlider, 'gallery slider');

    console.log('[App] Initialization complete');
});

export {};
