const {Server} = require('@frctl/server');
const {permalinkify} = require('@frctl/utils');

module.exports = function (pages) {

  const server = new Server();

  server.use(async (ctx, next) => {
    // TODO: proper error page
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `
        <h1>${err.message}</h1>
        <p>${err.stack}</p>
      `;
    }
  });

  server.use(async (ctx, next) => {
    const path = ctx.request.path;
    const permalink = permalinkify(ctx.request.path);

    await pages.build({filter: page => page.permalink === permalink});

    await next();
  });

  server.addStatic(pages.get('dest'));

  pages.watch();

  return server;
};
