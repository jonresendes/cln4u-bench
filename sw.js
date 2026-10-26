// Atlas Explorers offline support.
// Change VERSION whenever you upload a new index.html so phones pick up the update.
const VERSION = "atlas-v8";
const CORE = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "favicon-32.png",
  "icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from the cache first so the game opens instantly and offline,
// then refresh the cached copy in the background when online.
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !isFont) return;

  event.respondWith(
    caches.open(VERSION).then(async cache => {
      const key = req.mode === "navigate" ? "index.html" : req;
      const cached = await cache.match(key, { ignoreSearch: req.mode === "navigate" });
      const network = fetch(req)
        .then(res => {
          if (res && (res.ok || res.type === "opaque")) cache.put(key, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
