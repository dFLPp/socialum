const CACHE_NAME = 'word-siege-cache-v1';
const PRECACHE_URLS = [];

const shellUrls = [
  ...new Set([
    new URL('./', self.registration.scope).toString(),
    new URL('./index.html', self.registration.scope).toString(),
    ...PRECACHE_URLS.map((url) => new URL(url, self.registration.scope).toString()),
  ]),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(shellUrls)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cachedRequest = await caches.match(event.request);
          const cachedIndex = await caches.match(
            new URL('./index.html', self.registration.scope).toString()
          );
          const cachedScope = await caches.match(new URL('./', self.registration.scope).toString());
          return cachedRequest || cachedIndex || cachedScope || Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
