export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) {
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', window.location.href);
    navigator.serviceWorker.register(swUrl).catch(() => {
      // Offline support is a bonus; the game must still run if registration fails.
    });
  });
}
