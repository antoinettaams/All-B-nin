const CACHE_NAME = 'allo-benin-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/script.js',
  '/icons/icon-72x72.png',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});