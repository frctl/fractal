const koaBody = require('koa-body');

module.exports = function () {
  return {

    method: 'post',

    path: '/render',

    middleware: koaBody(),

    async handler(ctx, next) {
      // TODO: better error reporting
      const app = ctx.fractal;
      const components = await app.getComponents();

      const payload = ctx.request.body || [];

      if (!Array.isArray(payload)) {
        ctx.status = 400;
        return;
      }

      const pending = [];
      for (const request of payload) {
        const component = components.find(request.component);
        if (!component) {
          ctx.status = 400;
          return;
        }

        const variant = request.variant ? component.getVariant(request.variant) : component.getDefaultVariant();
        if (!variant) {
          ctx.status = 400;
          return;
        }

        const ext = request.ext;
        const context = request.context || {};
        const result = app.render(variant, context, {ext}).then(output => {
          return {
            requestData: request,
            component: component.toJSON(),
            variant: variant.toJSON(),
            context,
            output
          };
        });
        pending.push(result);
      }

      ctx.body = await Promise.all(pending);
    }
  };
};
