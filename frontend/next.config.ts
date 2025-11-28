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

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default withPWA({
  dest: "public",

  register: true,
  skipWaiting: true,

  // 🔥 MODO InjectManifest (usando TU propio SW)
  swSrc: "worker/custom-sw.js",   // <-- obligatorio
  swDest: "service-worker.js",    // <-- opcional pero recomendado

  // ❌ PROHIBIDO cuando usas InjectManifest
  // runtimeCaching: [],   <-- ELIMINADO

  disable: isDev,
})(nextConfig);
