const runtimeCaching = [
  {
    urlPattern: /^https:\/\/127\.0\.0\.1:8000\/api\/.*/i,
    handler: 'NetworkOnly',
  },
  {
    urlPattern: /^http:\/\/127\.0\.0\.1:8000\/api\/.*/i,
    handler: 'NetworkOnly',
  },
];

module.exports = {
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
};
