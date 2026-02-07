// Misc inits left in a single module
export function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => { preloader.classList.add('hidden'); document.body.style.overflow = ''; }, 500);
  });
  document.body.style.overflow = 'hidden';
}

export function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  const placeholder = document.getElementById('videoPlaceholder');
  if (!video || !placeholder) return;
  video.addEventListener('error', () => { video.style.display = 'none'; placeholder.style.display = 'flex'; });
  video.addEventListener('loadeddata', () => { video.style.display = 'block'; placeholder.style.display = 'none'; });
  const source = video.querySelector('source');
  if (source && !source.src) { video.style.display = 'none'; placeholder.style.display = 'flex'; }
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
      button.classList.add('active'); button.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(targetId); if (targetPanel) targetPanel.classList.add('active');
    });
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
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach((el, index) => {
    if (el.parentElement?.classList.contains('advantages__grid') || el.parentElement?.classList.contains('testimonials__grid')) el.dataset.delay = index * 100;
    observer.observe(el);
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
