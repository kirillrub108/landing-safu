/**
 * ================================================================
 * САФУ ЛЕНДИНГ - JAVASCRIPT (СЕВЕРОДВИНСК)
 * Направление 09.03.01 Информатика и вычислительная техника
 *
 * СОДЕРЖАНИЕ:
 * 1. Инициализация DOM
 * 2. Переключатель темы
 * 3. Прелоадер
 * 4. Навигация
 * 5. Hero видео
 * 6. Трек обучения
 * 7. Табы учебной программы
 * 8. Анимации при скролле
 * 9. Плавный скролл
 * 10. Вспомогательные функции
 * ================================================================
 */


/* ================================================================
   1. ИНИЦИАЛИЗАЦИЯ DOM
   Ждём полной загрузки DOM перед инициализацией
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все компоненты
    initThemeToggle();
    initPreloader();
    initNavigation();
    initHeroVideo();
    initEducationTrack();
    initTabs();
    initScrollAnimations();
    initSmoothScroll();
});


/* ================================================================
   2. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
   Управление светлой, тёмной и версией для слабовидящих
================================================================ */
function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-toggle__btn');
    const html = document.documentElement;

    if (themeButtons.length === 0) return;

    // Загружаем сохранённую тему из localStorage
    const savedTheme = localStorage.getItem('safu-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Обработчики клика по кнопкам темы
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
        });
    });

    /**
     * Устанавливает тему на странице
     * @param {string} theme - название темы (light, dark, accessible)
     */
    function setTheme(theme) {
        // Удаляем предыдущую тему
        html.removeAttribute('data-theme');

        // Устанавливаем новую тему (light - по умолчанию, без атрибута)
        if (theme !== 'light') {
            html.setAttribute('data-theme', theme);
        }

        // Обновляем состояние кнопок
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Сохраняем в localStorage
        localStorage.setItem('safu-theme', theme);

        // Объявляем для screen readers
        announceThemeChange(theme);
    }

    /**
     * Объявляет смену темы для accessibility
     * @param {string} theme - название темы
     */
    function announceThemeChange(theme) {
        const themeNames = {
            'light': 'Светлая тема',
            'dark': 'Тёмная тема',
            'accessible': 'Версия для слабовидящих'
        };

        // Создаём временный элемент для объявления
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        announcement.textContent = `Активирована: ${themeNames[theme]}`;

        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}


/* ================================================================
   3. ПРЕЛОАДЕР
   Скрывает прелоадер после загрузки страницы
================================================================ */
function initPreloader() {
    const preloader = document.querySelector('.preloader');

    if (!preloader) return;

    // Скрываем прелоадер после загрузки
    window.addEventListener('load', () => {
        // Небольшая задержка для плавности
        setTimeout(() => {
            preloader.classList.add('hidden');

            // Разрешаем скролл после скрытия прелоадера
            document.body.style.overflow = '';
        }, 500);
    });

    // Блокируем скролл пока загружается
    document.body.style.overflow = 'hidden';
}


/* ================================================================
   4. НАВИГАЦИЯ
   Управление состоянием навигации при скролле и мобильным меню
================================================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.nav__burger');
    const mobileMenu = document.querySelector('.nav__mobile');
    const mobileLinks = document.querySelectorAll('.nav__mobile a');

    // --- Состояние при скролле ---
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Добавляем фон при скролле
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- Мобильное меню ---
    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('open');

            burger.classList.toggle('active');
            mobileMenu.classList.toggle('open');

            // Блокируем скролл при открытом меню
            document.body.style.overflow = isOpen ? '' : 'hidden';

            // Обновляем aria-expanded
            burger.setAttribute('aria-expanded', !isOpen);
        });

        // Закрываем меню при клике на ссылку
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
}


/* ================================================================
   5. HERO ВИДЕО
   Проверка и управление видео в hero секции
================================================================ */
function initHeroVideo() {
    const video = document.querySelector('.hero__video');
    const placeholder = document.getElementById('videoPlaceholder');

    if (!video || !placeholder) return;

    // Проверяем, загрузилось ли видео
    video.addEventListener('error', () => {
        // Если видео не загрузилось, показываем placeholder
        video.style.display = 'none';
        placeholder.style.display = 'flex';
    });

    // Если видео загрузилось успешно
    video.addEventListener('loadeddata', () => {
        video.style.display = 'block';
        placeholder.style.display = 'none';
    });

    // Проверяем, есть ли источник видео
    const source = video.querySelector('source');
    if (source && !source.src) {
        video.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}


/* ================================================================
   6. ТРЕК ОБУЧЕНИЯ
   Анимация таймлайна 4 лет обучения
================================================================ */
function initEducationTrack() {
    const timeline = document.getElementById('educationTimeline');
    const years = document.querySelectorAll('.education-track__year');

    if (!timeline || years.length === 0) return;

    // Создаём observer для анимации трека при появлении в viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Запускаем анимацию прогресса
                timeline.classList.add('animated');

                // Последовательно активируем годы обучения
                years.forEach((year, index) => {
                    setTimeout(() => {
                        year.classList.add('active');
                    }, (index + 1) * 500); // Задержка для каждого года
                });

                // Отключаем observer после запуска анимации
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(timeline);

    // Интерактивность при наведении
    years.forEach(year => {
        year.addEventListener('mouseenter', () => {
            // Подсвечиваем выбранный год
            years.forEach(y => y.classList.remove('active'));
            year.classList.add('active');
        });
    });
}


/* ================================================================
   7. ТАБЫ УЧЕБНОЙ ПРОГРАММЫ
   Переключение между курсами
================================================================ */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tabs__btn');
    const tabPanels = document.querySelectorAll('.tabs__panel');

    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.tab;

            // Деактивируем все табы
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Активируем выбранный таб
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}


/* ================================================================
   8. АНИМАЦИИ ПРИ СКРОЛЛЕ
   Появление элементов при прокрутке страницы
================================================================ */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    // Создаём observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем задержку для каскадного эффекта
                const delay = entry.target.dataset.delay || 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                // Отключаем observer для этого элемента
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,      // Запускаем когда видно 15% элемента
        rootMargin: '0px 0px -50px 0px'  // Небольшой отступ снизу
    });

    // Наблюдаем за элементами
    revealElements.forEach((el, index) => {
        // Добавляем каскадную задержку для элементов в сетке
        if (el.parentElement?.classList.contains('advantages__grid') ||
            el.parentElement?.classList.contains('testimonials__grid')) {
            el.dataset.delay = index * 100;
        }

        observer.observe(el);
    });
}


/* ================================================================
   9. ПЛАВНЫЙ СКРОЛЛ
   Плавная прокрутка к якорным ссылкам
================================================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Пропускаем пустые якоря
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Вычисляем отступ для навигации
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


/* ================================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
================================================================ */

/**
 * Функция устранения дребезга (debounce) — ограничение частоты вызова функции
 * @param {Function} func - функция для выполнения
 * @param {number} wait - задержка в мс
 * @returns {Function}
 */
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

/**
 * Throttle - ограничение частоты вызова функции (не чаще чем раз в N мс)
 * @param {Function} func - функция для выполнения
 * @param {number} limit - минимальный интервал в мс
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;

    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


/* ================================================================
   ЭКСПОРТ ДЛЯ ВОЗМОЖНОГО ИСПОЛЬЗОВАНИЯ В ДРУГИХ МОДУЛЯХ
================================================================ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initThemeToggle,
        initPreloader,
        initNavigation,
        initHeroVideo,
        initEducationTrack,
        initTabs,
        initScrollAnimations,
        debounce,
        throttle
    };
}
