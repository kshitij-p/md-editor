const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  let proxyURL = 'http://localhost:8080/'

  if (process.env.NODE_ENV === 'production') {
    proxyURL = 'https://md-note-taker.herokuapp.com/'
  }

  app.use(
    createProxyMiddleware('/api', {
      target: proxyURL,
      changeOrigin: true,
    })
  );
};