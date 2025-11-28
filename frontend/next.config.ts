// @ts-nocheck
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sanarebackend-production.up.railway.app",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
    ],
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,

  // ⭐️ AQUÍ SE USA TU CUSTOM SERVICE WORKER REAL
  swSrc: "worker/custom-sw.js",        // <-- IMPORTANTE
  swDest: "service-worker.js",         // (opcional pero recomendado)

  runtimeCaching: [
    ...runtimeCaching,

    // ⭐ Navegación offline
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        cacheableResponse: { statuses: [0, 200] },
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },

    // ⭐ API Railway
    {
      urlPattern:
        /^https:\/\/sanarebackend-production\.up\.railway\.app\/.*$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        cacheableResponse: { statuses: [0, 200] },
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },

    // ⭐ Imágenes
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },

    // ⭐ Archivos estáticos
    {
      urlPattern: ({ request }) =>
        ["script", "style", "font"].includes(request.destination),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-cache",
      },
    },
  ],
})(nextConfig);
