const koaBody = require('koa-body');

module.exports = function () {
  return {

    method: 'post',

    path: '/components/:component/render',

    middleware: koaBody(),

    async handler(ctx, next) {
      const app = ctx.fractal;
      const components = await app.getComponents();
      const component = components.find(ctx.params.component);
      if (!component) {
        ctx.status = 404;
        return;
      }

      const variant = ctx.query.variant ? component.getVariant(ctx.query.variant) : component.getDefaultVariant();

      if (!variant) {
        ctx.status = 404;
        return;
      }

      ctx.type = 'html';
      ctx.body = await app.render(variant, ctx.request.body || {});
    }

  };
};
