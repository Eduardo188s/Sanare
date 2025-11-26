// Obligatorio para InjectManifest (precache manifest)
self.__WB_MANIFEST;

// Importaciones necesarias de Workbox
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

self.addEventListener("install", () => {
  console.log("[SW] Instalado");
});

// Cacheo de páginas del frontend
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

// Cacheo de API de clínicas
registerRoute(
  ({ url }) =>
    url.origin === "http://127.0.0.1:8000" &&
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
