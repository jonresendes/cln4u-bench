/* The Bench service worker — offline-first app shell. Bump VERSION on every deploy so installed copies update. */
const VERSION = 'bench-v1.0.1';
const SHELL = [
  './', './index.html', './style.css',
  './core.js', './games.js', './app.js', './lessons.js',
  './unit1.js', './unit2.js', './unit3.js', './unit4.js', './remedial.js',
  './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-512-maskable.png'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== VERSION + '-fonts').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('fonts.g')) {
    e.respondWith(caches.open(VERSION + '-fonts').then(async c => { const hit = await c.match(req); const net = fetch(req).then(r => { c.put(req, r.clone()); return r; }).catch(() => hit); return hit || net; }));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r.ok && url.origin === location.origin) caches.open(VERSION).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
