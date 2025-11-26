import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  swSrc: "public/custom-sw.js",
  runtimeCaching: require("next-pwa/cache")
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["127.0.0.1"],
  },
};

module.exports = withPWA(nextConfig);
