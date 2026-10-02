self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Purge any stale caches from previous shell versions
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never intercept or cache API requests, authenticated/dynamic pages, or non-GET requests
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/book") ||
    url.pathname.startsWith("/membership") ||
    url.pathname.startsWith("/community") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/join") ||
    event.request.mode === "navigate"
  ) {
    return;
  }

  // Only cache immutable static assets (_next/static, icons, images)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(
      caches.open("equinox-static-v2").then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        const response = await fetch(event.request);
        if (response && response.status === 200 && response.type === "basic") {
          cache.put(event.request, response.clone());
        }
        return response;
      })
    );
  }
});
