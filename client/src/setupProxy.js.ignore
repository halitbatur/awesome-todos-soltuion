let mw = require('http-proxy-middleware');

if ('function' !== typeof mw) {
  mw = mw['createProxyMiddleware'];
}

module.exports = function (app) {
  app.use(
    '/api',
    mw({
      target: process.env.REACT_APP_DEV_SERVER_HOST,
      changeOrigin: true,
    })
  );
};
