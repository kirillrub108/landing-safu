import { loadIncludes } from './includes.js';
import { initThemeToggle } from './theme.js';
import { initNavigation } from './nav.js';
import { initGallerySlider } from './slider.js';
import { initPreloader, initHeroVideo, initEducationTrack, initTabs, initFeaturePreview, initScrollAnimations, initSmoothScroll } from './others.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadIncludes();
    initThemeToggle();
    initPreloader();
    initNavigation();
    initHeroVideo();
    initEducationTrack();
    initTabs();
    initFeaturePreview();
    initScrollAnimations();
    initSmoothScroll();
    initGallerySlider();
});

export {};
