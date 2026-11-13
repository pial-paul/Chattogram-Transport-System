const ASSETS = ['index.html', 'styles.css', 'transit-data.js', 'planner.js', 'script.js'];
const scope = self.registration.scope;
const CACHE_PREFIX = `chattala-transit-${scope}-`;
const CACHE = `${CACHE_PREFIX}v3`;
const urls = ASSETS.map((asset) => new URL(asset, scope).href);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(urls)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
    .map((key) => caches.delete(key)))));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = '';
  if (event.request.mode === 'navigate' && (url.href === scope || url.href === urls[0])) {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then((cache) => cache.match(urls[0]))));
  } else if (urls.includes(url.href)) {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then((cache) => cache.match(url.href))));
  }
});
