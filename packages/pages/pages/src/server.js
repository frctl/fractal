const {extname} = require('path');
const {Server} = require('@frctl/server');

module.exports = async function (fractal, pages, opts = {}) {
  const server = new Server();
  let cache = {};

  server.use(async (ctx, next) => {
    // TODO: proper error page
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = `
        <h1>${err.message}</h1>
        <pre>${err.stack}</pre>
      `;
    }
  });

  server.use(async (ctx, next) => {
    if (pages.dirty || fractal.dirty) {
      cache = {};
    }
    if (cache[ctx.request.path]) {
      ctx.type = extname(ctx.request.path);
      ctx.body = cache[ctx.request.path];
      return;
    }
    await next();
  });

  server.use(async (ctx, next) => {
    const url = ctx.request.path;
    try {
      const output = await pages.build(fractal, {
        pages: [url]
      });
      const requested = output[0];
      if (requested) {
        ctx.type = requested.extname;
        ctx.body = String(requested.contents);
        cache[url] = ctx.body;
      }
    } catch (err) {
      pages.dirty = true;
      ctx.throw(400, err);
    }
  });

  server.addStatic(pages.get('dest'));

  await Promise.all([pages, fractal].map(app => {
    app.watch();
    return app.parse();
  }));

  await server.start(opts.port);

  return server;
};
