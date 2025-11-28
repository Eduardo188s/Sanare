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
  disable: isDev,

  // ⭐ Usa el SW manual desde /public/worker/
  sw: "worker/custom-sw.js",
})(nextConfig);
