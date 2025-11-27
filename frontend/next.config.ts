
// @ts-nocheck  // necesario por next-pwa + TS
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const withPwaConfigured = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  runtimeCaching: [
    ...runtimeCaching,

    // --- Navegación / Páginas ---
    {
      urlPattern: ({ request, url }) =>
        request.mode === "navigate" && !url.pathname.startsWith("/api"),
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // --- API Railway ---
    {
      urlPattern: /^https:\/\/sanarebackend-production\.up\.railway\.app\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // --- Imágenes ---
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // --- Scripts, CSS, Fuentes ---
    {
      urlPattern: ({ request }) =>
        ["script", "style", "font"].includes(request.destination),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-cache",
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],

  customWorkerDir: "sw.js",
});

export default withPwaConfigured({
  reactStrictMode: true,

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
});