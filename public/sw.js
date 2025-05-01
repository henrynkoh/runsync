const CACHE_NAME = 'runsync-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/training',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/app/page.js',
  '/_next/static/chunks/app/training/page.js'
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
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
}); 