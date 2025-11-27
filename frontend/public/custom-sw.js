// Obligatorio para InjectManifest
self.__WB_MANIFEST;

import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

self.addEventListener("install", () => {
  console.log("[SW] Instalado");
});

// ⭐ NUEVO: Cachear inicio y páginas principales cuando está offline
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// Cacheo de páginas de clínicas
registerRoute(
  ({ url }) => url.pathname.startsWith("/paciente/clinicas/"),
  new StaleWhileRevalidate({
    cacheName: "clinicas-pages",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

// Cacheo de API
registerRoute(
  ({ url }) =>
    url.origin === "https://sanarebackend-production.up.railway.app" &&
    url.pathname.startsWith("/api/clinicas/") &&
    !url.pathname.includes("horarios_disponibles"),
  new NetworkFirst({
    cacheName: "clinicas-api-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
      }),
    ],
  })
);
