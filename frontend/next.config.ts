// @ts-nocheck
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,

  // ⭐ InjectManifest con SW personalizado
  swSrc: "public/worker/custom-sw.js",
  swDest: "service-worker.js",  // Se genera en /public
})({
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
});
