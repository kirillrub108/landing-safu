export function initGallerySlider() {
  const slider = document.querySelector('.gallery__slider');
  if (!slider) return;
  const track = slider.querySelector('.gallery__track');
  const slides = Array.from(slider.querySelectorAll('.gallery__slide'));
  const prevBtn = slider.querySelector('.gallery__nav--prev');
  const nextBtn = slider.querySelector('.gallery__nav--next');
  const dotsContainer = slider.querySelector('.gallery__dots');
  let index = 0;
  let autoplayId = null;
  const AUTOPLAY_DELAY = 5000;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery__dot';
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goTo(slideIndex) {
    index = (slideIndex + slides.length) % slides.length;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
    dots.forEach(d => d.classList.toggle('active', Number(d.dataset.index) === index));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  dots.forEach(d => d.addEventListener('click', (e) => { goTo(Number(e.currentTarget.dataset.index)); resetAutoplay(); }));

  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
    if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
  });

  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  slider.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); resetAutoplay(); }
  });

  function startAutoplay() { if (autoplayId) return; autoplayId = setInterval(() => { next(); }, AUTOPLAY_DELAY); }
  function stopAutoplay() { if (!autoplayId) return; clearInterval(autoplayId); autoplayId = null; }
  function resetAutoplay() { stopAutoplay(); startAutoplay(); }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);

  slider.setAttribute('tabindex', '0');
  goTo(0);
  startAutoplay();
}
