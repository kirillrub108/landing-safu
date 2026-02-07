// Loads HTML partials referenced by data-include attributes.
// Requires an HTTP server (fetch does not work on file:// protocol).
export async function loadIncludes() {
  const slots = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(slots).map(async (el) => {
    try {
      const resp = await fetch(el.dataset.include);
      if (resp.ok) el.outerHTML = await resp.text();
    } catch (e) {
      console.warn(`Failed to load ${el.dataset.include}:`, e);
    }
  }));
}
