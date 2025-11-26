self.addEventListener("install", () => {
  console.log("[SW] Instalado");
});

workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/paciente/clinicas/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "clinicas-pages",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === "http://127.0.0.1:8000" &&
    url.pathname.startsWith("/api/clinicas/") &&
    !url.pathname.includes("horarios_disponibles"),
  new workbox.strategies.NetworkFirst({
    cacheName: "clinicas-api-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
      }),
    ],
  })
);
