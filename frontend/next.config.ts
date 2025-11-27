// @ts-nocheck

/** 
 * CONFIGURACIÓN COMPLETA Y CORREGIDA PARA NEXT + NEXT-PWA + INJECTMANIFEST
 */

import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";
import { InjectManifest } from "workbox-webpack-plugin";

// ---- PWA CONFIG ----
const pwa = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  // -------------------------------------------------------------------
  // 🔥 INJECTMANIFEST — IMPORTANTE PARA USAR TU ARCHIVO custom-sw.js
  // -------------------------------------------------------------------
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new InjectManifest({
          swSrc: "./custom-sw.js",        // TU SERVICE WORKER PERSONALIZADO ORIGINAL
          swDest: "service-worker.js",     // SE CREA EN /public AUTOMÁTICAMENTE
        })
      );
    }
    return config;
  },

  // -------------------------------------------------------------------
  // CACHEO AUTOMÁTICO POR next-pwa
  // -------------------------------------------------------------------
  runtimeCaching: [
    ...runtimeCaching,

    // Cacheo de navegación HTML
    {
      urlPattern: ({ request }) => request.mode === "navigate",
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

    // 📡 API SANARE
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

    // 🖼️ Imágenes
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

    // JS, CSS, FUENTES
    {
      urlPattern: ({ request }) =>
        ["script", "style", "font"].includes(request.destination),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-cache",
      },
    },
  ],
});

// ---- NEXT CONFIG BASE ----
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

// ---- EXPORT FINAL ----
export default pwa(nextConfig);
