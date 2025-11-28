import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

/*
 * Este SW SOLO maneja cache dinámico (runtime).
 * InjectManifest ya mete el precache automático.
 */

/* ---------------------------------------------------------
   1. NAVEGACIÓN OFFLINE (todas las rutas Next.js)
--------------------------------------------------------- */
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

/* ---------------------------------------------------------
   2. API GENERAL — TODAS tus API del backend en Railway
--------------------------------------------------------- */
registerRoute(
  ({ url }) =>
    url.origin === "https://sanarebackend-production.up.railway.app" &&
    url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 4,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
      }),
    ],
  })
);

/* ---------------------------------------------------------
   3. API LOCAL (para desarrollo offline)
--------------------------------------------------------- */
registerRoute(
  ({ url }) =>
    url.origin === "http://127.0.0.1:8000" &&
    url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "local-api-cache",
    networkTimeoutSeconds: 4,
  })
);

/* ---------------------------------------------------------
   ⭐ 4. IMÁGENES
--------------------------------------------------------- */
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 días
      }),
    ],
  })
);

/* ---------------------------------------------------------
   ⭐ 5. ARCHIVOS ESTÁTICOS (JS, CSS, fuentes)
--------------------------------------------------------- */
registerRoute(
  ({ request }) =>
    ["script", "style", "font"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "static-assets",
  })
);

/* ---------------------------------------------------------
   ⭐ 6. JSON, datos, iconos
--------------------------------------------------------- */
registerRoute(
  ({ request }) =>
    ["manifest", "json"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "data-cache",
  })
);

/* ---------------------------------------------------------
   7. FALLBACK OPCIONAL (si quieres una página offline)
--------------------------------------------------------- */
self.addEventListener("fetch", (event) => {
   if (event.request.mode === "navigate") {
     event.respondWith(
       fetch(event.request).catch(() => caches.match("/offline.html"))
     );
   }
 });

