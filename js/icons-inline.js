/*
 * Optional runtime SVG sprite inliner
 * - Inlines `assets/icons.svg` into the document when running from `file:` protocol
 *   or when enabled via `document.documentElement.dataset.inlineSvg = 'true'`
 *   or when `localStorage['safu-inline-sprite'] === '1'`.
 * - Safe to load on HTTP too (duplicates symbols but harmless).
 */

(function() {
  // Always inline by default (works on HTTP and file:). To disable, set
  // document.documentElement.dataset.inlineSvg = 'false' or localStorage['safu-inline-sprite']='0'.
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
      // parsing/insertion failed
      console.warn('icons-inline: failed to insert sprite', e);
    }
  }

  // Try fetch first
  fetch(url, {cache: 'force-cache'})
    .then(resp => {
      if (!resp.ok) throw new Error('status ' + resp.status);
      return resp.text();
    })
    .then(insertSvg)
    .catch(() => {
      // Fallback to XHR for environments where fetch is blocked
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
