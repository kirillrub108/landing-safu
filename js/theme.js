import { debounce } from './utils.js';

export function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-toggle__btn');
  const html = document.documentElement;
  if (themeButtons.length === 0) return;

  const savedTheme = localStorage.getItem('safu-theme');
  if (savedTheme) setTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  function setTheme(theme) {
    html.removeAttribute('data-theme');
    if (theme !== 'light') html.setAttribute('data-theme', theme);
    themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
    localStorage.setItem('safu-theme', theme);
    announceThemeChange(theme);
  }

  function announceThemeChange(theme) {
    const themeNames = {
      'light': 'Светлая тема',
      'dark': 'Тёмная тема',
      'accessible': 'Версия для слабовидящих'
    };
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
