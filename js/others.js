// Разные инициализации в одном модуле
export function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) {
    console.warn('[Preloader] Element not found');
    return;
  }

  document.body.style.overflow = 'hidden';

  let isHidden = false;
  const hidePreloader = () => {
    if (isHidden) return;
    isHidden = true;
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Запускаем анимации когда шрифты готовы, затем прячем прелоадер
  // ровно после того как последнее слово появилось на экране.
  // Слово --i:3: задержка 0.81s + длительность 0.65s = 1.46s → +250ms буфер = 1710ms
  const HIDE_AFTER_MS = 1710;

  let started = false;
  const startAnimations = () => {
    if (started) return;
    started = true;
    preloader.classList.add('preloader--ready');
    setTimeout(hidePreloader, HIDE_AFTER_MS);
  };

  // Резервный таймаут 2с если document.fonts.ready не сработает
  const fontsTimeout = setTimeout(startAnimations, 2000);
  document.fonts.ready.then(() => {
    clearTimeout(fontsTimeout);
    startAnimations();
  });

  // Страховочный таймаут: не более 10 секунд в любом случае
  setTimeout(hidePreloader, 10000);
}

export function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  const placeholder = document.getElementById('videoPlaceholder');
  if (!video || !placeholder) return;

  let videoLoaded = false;

  const showPlaceholder = () => {
    if (videoLoaded) return;
    video.style.display = 'none';
    placeholder.style.display = 'flex';
  };

  const showVideo = () => {
    videoLoaded = true;
    video.style.display = 'block';
    placeholder.style.display = 'none';
  };

  // Показываем placeholder при ошибке загрузки
  video.addEventListener('error', showPlaceholder);

  // Показываем видео когда данные загружены
  video.addEventListener('loadeddata', showVideo);

  // Проверяем есть ли src у source
  const source = video.querySelector('source');
  if (source && !source.src) {
    showPlaceholder();
    return;
  }

  // Таймаут: если видео не загрузилось за 3 секунды, показываем placeholder
  // (не блокируем загрузку страницы из-за медленного/несуществующего видео)
  setTimeout(() => {
    if (!videoLoaded) {
      console.warn('[HeroVideo] Loading timeout - showing placeholder');
      showPlaceholder();
    }
  }, 3000);
}

export function initEducationTrack() {
  const timeline = document.getElementById('educationTimeline');
  const years = document.querySelectorAll('.education-track__year');
  if (!timeline || years.length === 0) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('animated');
        years.forEach((year, index) => setTimeout(() => year.classList.add('active'), (index + 1) * 500));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });
  observer.observe(timeline);
  years.forEach(year => year.addEventListener('mouseenter', () => { years.forEach(y => y.classList.remove('active')); year.classList.add('active'); }));
}

export function initTabs() {
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  if (tabButtons.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.tab;
      tabButtons.forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Инициализируем карусель при первом показе панели
        const carousel = targetPanel.querySelector('.curr-carousel');
        if (carousel && !carousel._initialized) _initCurrCarousel(carousel);
      }
    });
  });

  // Инициализируем карусель для изначально активной панели
  const activePanel = document.querySelector('.tabs__panel.active');
  if (activePanel) {
    const carousel = activePanel.querySelector('.curr-carousel');
    if (carousel) _initCurrCarousel(carousel);
  }
}

function _initCurrCarousel(carouselEl) {
  if (carouselEl._initialized) return;
  carouselEl._initialized = true;

  const viewport = carouselEl.querySelector('.curr-carousel__viewport');
  const track    = carouselEl.querySelector('.curr-carousel__track');
  if (!track || !viewport) return;

  const origSlides = Array.from(track.querySelectorAll('.curr-carousel__slide'));
  const total = origSlides.length;
  if (total < 2) return;

  // Клонируем все слайды и добавляем в конец — этого достаточно для петли:
  // анимация translateX(-50%) пройдёт ровно длину оригинала и вернётся к началу
  origSlides.forEach(s => {
    const c = s.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.dataset.clone = '';
    track.append(c);
  });

  function getVisible() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function computeDimensions() {
    if (!viewport.clientWidth) return;
    const visible  = getVisible();
    const slideW   = viewport.clientWidth / visible;
    track.style.width = (total * 2 * slideW) + 'px';
    Array.from(track.children).forEach(slide => {
      slide.style.flex = '0 0 ' + slideW + 'px';
    });
  }

  // Запускаем анимацию один раз: 3.5 с на каждый слайд = умеренная скорость
  const duration = total * 3.5;
  track.style.animation = duration + 's curr-scroll linear infinite';

  computeDimensions();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    // Только пересчитываем размеры — анимация продолжается без сброса
    resizeTimer = setTimeout(computeDimensions, 150);
  });
}

export function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 300px 0px' });

  const advantagesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        advantagesObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 550px 0px' });

  revealElements.forEach((el, index) => {
    if (el.parentElement?.classList.contains('advantages__grid')) {
      el.dataset.delay = index * 50;
      advantagesObserver.observe(el);
    } else {
      observer.observe(el);
    }
  });
}

export function initFeaturePreview() {
  const features = document.querySelectorAll('.about__feature--with-image[data-feature]');
  const preview = document.querySelector('.about__preview');
  if (!features.length || !preview) return;

  let activeFeature = null;

  function showPreview(index) {
    preview.querySelectorAll('[data-preview]').forEach(el => el.classList.remove('active'));
    const target = preview.querySelector(`[data-preview="${index}"]`);
    if (target) target.classList.add('active');
    preview.classList.add('active');
    activeFeature = index;
  }

  function hidePreview() {
    preview.classList.remove('active');
    activeFeature = null;
  }

  features.forEach(feature => {
    const index = feature.dataset.feature;

    // Desktop: show/hide on hover
    feature.addEventListener('mouseenter', () => showPreview(index));
    feature.addEventListener('mouseleave', () => hidePreview());

    // Mobile: toggle on tap; preventDefault stops synthetic mouse events
    feature.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (activeFeature === index) { hidePreview(); } else { showPreview(index); }
    });
  });

  // Close on outside tap
  document.addEventListener('touchend', (e) => {
    if (activeFeature !== null && !e.target.closest('.about__feature--with-image') && !e.target.closest('.about__preview')) {
      hidePreview();
    }
  });
}

export function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href'); if (href === '#') return;
      const target = document.querySelector(href); if (target) { e.preventDefault(); const navHeight = document.querySelector('.nav')?.offsetHeight || 0; const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight; window.scrollTo({ top: targetPosition, behavior: 'smooth' }); }
    });
  });
}
