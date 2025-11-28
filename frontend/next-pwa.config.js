// next-pwa.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  // IMPORTANTE: tu service worker custom
  swSrc: "worker/custom-sw.js",

  runtimeCaching: [
    {
      urlPattern: /^https:\/\/127\.0\.0\.1:8000\/api\/.*/i,
      handler: 'NetworkOnly',
    },
    {
      urlPattern: /^http:\/\/127\.0\.0\.1:8000\/api\/.*/i,
      handler: 'NetworkOnly',
    },
  ],
});

module.exports = withPWA({});
