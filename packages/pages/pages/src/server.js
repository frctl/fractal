const {Server} = require('@frctl/server');

module.exports = function (pages) {

  const server = new Server();

  server.use(async ctx => {
    ctx.body = 'pages development server'
  });

  return server;
};
