self.addEventListener("install", event => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open("quicksos-cache").then(cache =>
      cache.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        );
      })
    )
  );
});