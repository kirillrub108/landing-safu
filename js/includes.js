// Загружает HTML части по атрибутам data-include.
// Требует HTTP сервер (fetch не работает на file:// протоколе).
export async function loadIncludes() {
  const slots = document.querySelectorAll('[data-include]');
  console.log(`[Includes] Loading ${slots.length} sections...`);

  // Функция для загрузки с таймаутом
  const fetchWithTimeout = async (url, timeout = 5000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const results = await Promise.allSettled(Array.from(slots).map(async (el) => {
    const path = el.dataset.include;
    try {
      const resp = await fetchWithTimeout(path, 5000);
      if (resp.ok) {
        const html = await resp.text();
        el.outerHTML = html;
        console.log(`[Includes] ✓ Loaded: ${path}`);
      } else {
        console.error(`[Includes] ✗ Failed (${resp.status}): ${path}`);
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        console.error(`[Includes] ✗ Timeout: ${path}`);
      } else {
        console.error(`[Includes] ✗ Error loading ${path}:`, e.message);
      }
    }
  }));

  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed > 0) {
    console.warn(`[Includes] Warning: ${failed} section(s) failed to load`);
  } else {
    console.log('[Includes] All sections loaded successfully');
  }
}
