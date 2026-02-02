/**
 * ================================================================
 * SAFU LANDING PAGE - JAVASCRIPT
 * Направление 09.03.01 Информатика и вычислительная техника
 * 
 * СОДЕРЖАНИЕ:
 * 1. Инициализация DOM
 * 2. Прелоадер
 * 3. Кастомный курсор
 * 4. Навигация
 * 5. Система частиц (Canvas)
 * 6. Счётчик чисел
 * 7. Табы учебной программы
 * 8. Слайдер преподавателей
 * 9. Анимации при скролле
 * 10. Вспомогательные функции
 * ================================================================
 */


/* ================================================================
   1. ИНИЦИАЛИЗАЦИЯ DOM
   Ждём полной загрузки DOM перед инициализацией
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все компоненты
    initPreloader();
    initCursor();
    initNavigation();
    initParticles();
    initCounters();
    initTabs();
    initSlider();
    initScrollAnimations();
    initSmoothScroll();
});


/* ================================================================
   2. ПРЕЛОАДЕР
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
   3. КАСТОМНЫЙ КУРСОР
   Следует за мышью с плавной анимацией
================================================================ */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    
    // Проверяем поддержку hover (исключаем тач-устройства)
    if (!cursor || !window.matchMedia('(hover: hover)').matches) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Коэффициент сглаживания (0-1, меньше = плавнее)
    const smoothing = 0.15;
    
    // Отслеживаем позицию мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Показываем курсор при первом движении
        if (!cursor.classList.contains('visible')) {
            cursor.classList.add('visible');
        }
    });
    
    // Скрываем курсор при выходе за пределы окна
    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.classList.add('visible');
    });
    
    // Анимация движения курсора с использованием requestAnimationFrame
    function animateCursor() {
        // Плавное следование за мышью
        cursorX += (mouseX - cursorX) * smoothing;
        cursorY += (mouseY - cursorY) * smoothing;
        
        // Применяем позицию (центрируем курсор)
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Эффект при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .card, .career__role, .teacher, .gallery__item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
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
   5. СИСТЕМА ЧАСТИЦ (Canvas)
   Анимированные частицы с соединительными линиями
================================================================ */
function initParticles() {
    const canvas = document.getElementById('particles');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Настройки частиц - минималистичные
    const config = {
        particleCount: 35,          // Меньше частиц
        particleSize: 1.5,          // Меньше размер
        connectionDistance: 120,    // Короче линии
        speed: 0.3,                 // Медленнее
        color: '0, 212, 255'        // Цвет (RGB)
    };
    
    // Класс частицы
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.radius = Math.random() * config.particleSize + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1; // Более прозрачные
        }
        
        update() {
            // Движение
            this.x += this.vx;
            this.y += this.vy;
            
            // Отражение от границ
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.color}, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Изменение размера canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Пересоздаём частицы при изменении размера
        initParticlesArray();
    }
    
    // Инициализация массива частиц
    function initParticlesArray() {
        particles = [];
        
        // Уменьшаем количество на мобильных для производительности
        const count = window.innerWidth < 768 
            ? Math.floor(config.particleCount / 2) 
            : config.particleCount;
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    // Отрисовка соединительных линий
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    const opacity = 1 - (distance / config.connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${config.color}, ${opacity * 0.15})`; // Тоньше линии
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Основной цикл анимации
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Обновляем и рисуем частицы
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Рисуем соединения
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Инициализация
    resize();
    window.addEventListener('resize', debounce(resize, 250));
    animate();
    
    // Останавливаем анимацию при скрытии страницы для экономии ресурсов
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}


/* ================================================================
   6. СЧЁТЧИК ЧИСЕЛ
   Анимированный подсчёт чисел в статистике
================================================================ */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length === 0) return;
    
    // Настройки анимации
    const duration = 2000; // Длительность анимации в мс
    const fps = 60;        // Кадров в секунду
    
    // Создаём observer для отслеживания появления элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                
                animateCounter(counter, target);
                
                // Отключаем observer после анимации
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5, // Запускаем когда элемент виден на 50%
        rootMargin: '0px'
    });
    
    // Наблюдаем за каждым счётчиком
    counters.forEach(counter => observer.observe(counter));
    
    // Функция анимации счётчика
    function animateCounter(element, target) {
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Функция замедления (easeOutQuart)
            const eased = 1 - Math.pow(1 - progress, 4);
            
            // Вычисляем текущее значение
            const current = Math.floor(startValue + (target - startValue) * eased);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(update);
    }
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
   8. СЛАЙДЕР ПРЕПОДАВАТЕЛЕЙ
   Карусель с карточками преподавателей
================================================================ */
function initSlider() {
    const track = document.getElementById('teachersTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const cards = track.querySelectorAll('.teacher');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    const totalCards = cards.length;
    
    // Определяем количество карточек в зависимости от ширины экрана
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }
    
    // Обновляем позицию слайдера
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // gap между карточками (2rem)
        const offset = currentIndex * (cardWidth + gap);
        
        track.style.transform = `translateX(-${offset}px)`;
        
        // Обновляем состояние кнопок
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalCards - cardsPerView;
    }
    
    // Переход к предыдущему слайду
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Переход к следующему слайду
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - cardsPerView) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Обработка изменения размера окна
    window.addEventListener('resize', debounce(() => {
        cardsPerView = getCardsPerView();
        
        // Корректируем индекс если нужно
        if (currentIndex > totalCards - cardsPerView) {
            currentIndex = Math.max(0, totalCards - cardsPerView);
        }
        
        updateSlider();
    }, 250));
    
    // Начальное состояние
    updateSlider();
    
    // Поддержка свайпов на мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < totalCards - cardsPerView) {
                // Свайп влево - следующий слайд
                currentIndex++;
                updateSlider();
            } else if (diff < 0 && currentIndex > 0) {
                // Свайп вправо - предыдущий слайд
                currentIndex--;
                updateSlider();
            }
        }
    }
}


/* ================================================================
   9. АНИМАЦИИ ПРИ СКРОЛЛЕ
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
   10. ПЛАВНЫЙ СКРОЛЛ
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
 * Debounce - ограничение частоты вызова функции
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
        initPreloader,
        initCursor,
        initNavigation,
        initParticles,
        initCounters,
        initTabs,
        initSlider,
        initScrollAnimations,
        debounce,
        throttle
    };
}
