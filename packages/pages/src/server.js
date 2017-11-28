const {Server} = require('@frctl/server');

module.exports = async function (pages, opts = {}) {
  const server = new Server();
  const fractal = pages.fractal;
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
      const cached = cache[ctx.request.path];
      ctx.type = cached.extname;
      ctx.body = String(cached.contents);
      return;
    }
    await next();
  });

  server.use(async (ctx, next) => {
    const url = ctx.request.path;
    try {
      const output = await pages.build({
        filter: [url]
      });
      const requested = output[0];
      if (requested) {
        ctx.type = requested.extname;
        ctx.body = String(requested.contents);
        cache[url] = requested;
      }
    } catch (err) {
      pages.dirty = true;
      ctx.throw(400, err);
    }
  });

  if (pages.get('dest')) {
    server.addStatic(pages.get('dest'));
  }

  await Promise.all([pages, fractal].map(app => {
    app.watch();
    return app.parse();
  }));

  await server.start(opts.port);

  return server;
};
