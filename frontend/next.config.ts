// @ts-nocheck
import withPWA from "next-pwa";

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
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,

  // ⭐ MODO CORRECTO PARA USAR TU PROPIO SERVICE WORKER
  workbox: {
    swSrc: "worker/service-worker.js",    // archivo fuente
    swDest: "public/service-worker.js",   // archivo final en producción
  },

})(nextConfig);
