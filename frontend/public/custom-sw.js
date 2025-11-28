import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

/*
 * ⭐ NEXT-PWA YA MANEJA EL PRECACHE
 * No necesitas __WB_MANIFEST.
 * Este archivo solo agrega rutas runtime extras.
 */

// Cache para navegación (inicio OFFLINE)
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

// Cache de páginas /paciente/clinicas/
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

// Cache API de Clínicas
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
