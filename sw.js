
const CACHE_NAME = "portfolio-1-v3";

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(CORE_FILES);

      // Optional files: cache only if available
      await Promise.all(
        ["./profile.jpg", "./icon-192.svg", "./icon-512.svg"].map(
          file => cache.add(file).catch(() => {})
        )
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("portfolio-1-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  ) return;

  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request);
    })
  );
});
