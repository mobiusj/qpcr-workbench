const scope = new URL(self.registration.scope);
const prefix = 'qpcr-workbench:' + scope.pathname + ':';
const cacheName = prefix + '1.9.4';
const files = [
  './', './qPCR-384.html', './install.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png',
].map(path => new URL(path, scope).href);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(files.map(url => new Request(url, {cache: 'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  if (request.mode === 'navigate') url.search = '';
  const entry = url.href === new URL('index.html', scope).href ? scope.href : url.href;
  if (!files.includes(entry)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return await cache.match(entry) || fetch(request);
  })());
});
