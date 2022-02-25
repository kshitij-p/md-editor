const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://md-note-taker.herokuapp.com/',
      changeOrigin: true,
    })
  );
};