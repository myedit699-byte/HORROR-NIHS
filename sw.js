// Offline: i-save ang tibuok dula sa phone. Kung online, kuhaon ang bag-ong bersyon sa luyo ug mogawas sa sunod nga abli.
const V = 'nihs-app-v2';
const PAGE = './index.html';
const FILES = [PAGE, './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install', e => e.waitUntil(
  caches.open(V).then(c => c.addAll(FILES.map(u => new Request(u, { mode: 'cors', cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('nihs') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    const net = fetch(PAGE, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const copy = res.clone(); return caches.open(V).then(c => c.put(PAGE, copy)).then(() => res); }
      return res;
    });
    e.waitUntil(net.catch(() => {}));
    e.respondWith(caches.match(PAGE).then(hit => hit || net));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r)));
});
