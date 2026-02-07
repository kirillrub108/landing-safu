/*
 * Опциональный runtime инлайнер SVG sprite
 * - Встраивает `assets/icons.svg` в документ при запуске на `file:` протоколе
 *   или когда включено через `document.documentElement.dataset.inlineSvg = 'true'`
 *   или когда `localStorage['safu-inline-sprite'] === '1'`.
 * - Безопасно загружать и на HTTP (дублирует symbols, но безвредно).
 */

(function() {
  // По умолчанию всегда встраиваем (работает на HTTP и file:). Чтобы отключить, установите
  // document.documentElement.dataset.inlineSvg = 'false' или localStorage['safu-inline-sprite']='0'.
  const disabled = document.documentElement.dataset.inlineSvg === 'false' || localStorage.getItem('safu-inline-sprite') === '0';
  if (disabled) return;
  const url = 'assets/icons.svg';

  function insertSvg(svgText) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      svg.style.width = 0;
      svg.style.height = 0;
      svg.style.overflow = 'hidden';
      svg.dataset.inlinedSprite = 'true';

      const place = document.body || document.documentElement;
      if (place.firstChild) place.insertBefore(svg, place.firstChild);
      else place.appendChild(svg);
    } catch (e) {
      // парсинг/вставка провалилась
      console.warn('icons-inline: failed to insert sprite', e);
    }
  }

  // Сначала пробуем fetch
  fetch(url, {cache: 'force-cache'})
    .then(resp => {
      if (!resp.ok) throw new Error('status ' + resp.status);
      return resp.text();
    })
    .then(insertSvg)
    .catch(() => {
      // Fallback на XHR для окружений где fetch заблокирован
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
            insertSvg(xhr.responseText);
          }
        };
        xhr.send();
      } catch (e) {
        console.warn('icons-inline: fetch/xhr failed', e);
      }
    });

})();
