const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  // app.use(
  //   [
  //     "/registration"
  //   ],
  //   createProxyMiddleware({
  //     target:
  //       "http://localhost:8080/api"
  //   })
  // );
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathFilter: '/api',
      onBeforeSetupMiddleware: undefined,
      onAfterSetupMiddleware: undefined,
    }),
  );
};
