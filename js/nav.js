export function initNavigation() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile a');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  }, { passive: true });

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      nav.classList.toggle('menu-open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
      burger.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        nav.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }
}
