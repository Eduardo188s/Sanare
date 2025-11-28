import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

/*
 * ⭐ NEXT-PWA (InjectManifest) maneja el PRECACHE automáticamente.
 * NO necesitas self.__WB_MANIFEST.
 * Este archivo solo define reglas de cacheo dinámico (runtime).
 */

/* ---------------------------------------------------------
   ⭐ CACHE DE NAVEGACIÓN (Soporte Offline)
--------------------------------------------------------- */
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
      }),
    ],
  })
);

/* ---------------------------------------------------------
   ⭐ CACHE DE PÁGINAS DE CLÍNICAS
--------------------------------------------------------- */
registerRoute(
  ({ url }) => url.pathname.startsWith("/paciente/clinicas/"),
  new StaleWhileRevalidate({
    cacheName: "clinicas-pages",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 día
      }),
    ],
  })
);

/* ---------------------------------------------------------
   ⭐ CACHE API DE CLÍNICAS (Railway)
--------------------------------------------------------- */
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
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

  registerRoute(
    ({ request }) => request.destination === "image",
    new StaleWhileRevalidate({
      cacheName: "images-cache",
      plugins: [new ExpirationPlugin({ maxEntries: 60 })],
    })
  );

