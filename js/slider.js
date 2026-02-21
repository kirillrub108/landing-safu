export function initGallerySlider() {
  const slider = document.querySelector('.gallery__slider');
  if (!slider) return;
  const track = slider.querySelector('.gallery__track');
  const slides = Array.from(slider.querySelectorAll('.gallery__slide'));
  const prevBtn = slider.querySelector('.gallery__nav--prev');
  const nextBtn = slider.querySelector('.gallery__nav--next');
  const dotsContainer = slider.querySelector('.gallery__dots');

  const count = slides.length;
  if (count === 0) return;

  let autoplayId = null;
  const AUTOPLAY_DELAY = 5000;

  const lastClone = slides[count - 1].cloneNode(true);
  const firstClone = slides[0].cloneNode(true);
  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  let currentIndex = 1;

  function setTransform(index, animated) {
    track.style.transition = animated ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(${-index * 100}%)`;
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery__dot';
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function updateDots(internalIndex) {
    let realIndex = internalIndex - 1;
    if (realIndex < 0) realIndex = count - 1;
    if (realIndex >= count) realIndex = 0;
    dots.forEach(d => d.classList.toggle('active', Number(d.dataset.index) === realIndex));
  }

  // Если мы сейчас на клоне (во время перехода), мгновенно прыгаем на реальный слайд
  function snapToReal() {
    if (currentIndex === 0) {
      currentIndex = count;
      setTransform(currentIndex, false);
      track.getBoundingClientRect(); // принудительный reflow
    } else if (currentIndex === count + 1) {
      currentIndex = 1;
      setTransform(currentIndex, false);
      track.getBoundingClientRect();
    }
  }

  function goTo(index) {
    currentIndex = index;
    setTransform(currentIndex, true);
    updateDots(currentIndex);
  }

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    if (currentIndex === 0) {
      currentIndex = count;
      setTransform(currentIndex, false);
    } else if (currentIndex === count + 1) {
      currentIndex = 1;
      setTransform(currentIndex, false);
    }
  });

  function next() { snapToReal(); goTo(currentIndex + 1); }
  function prev() { snapToReal(); goTo(currentIndex - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  dots.forEach(d => d.addEventListener('click', (e) => {
    snapToReal();
    goTo(Number(e.currentTarget.dataset.index) + 1);
    resetAutoplay();
  }));

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
  setTransform(currentIndex, false);
  updateDots(currentIndex);
  startAutoplay();
}
