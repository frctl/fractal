const koaBody = require('koa-body');

module.exports = function () {
  return {

    method: 'post',

    path: '/render',

    middleware: koaBody(),

    async handler(ctx, next) {
      // TODO: better error reporting
      const payload = ctx.request.body || [];

      if (!Array.isArray(payload)) {
        ctx.status = 400;
        return;
      }

      const pending = [];
      for (const request of payload) {
        const component = ctx.components.find(request.component);
        if (!component) {
          ctx.throw(400, 'Component not found');
        }

        const variant = request.variant ? component.getVariant(request.variant) : component.getDefaultVariant();
        if (!variant) {
          ctx.throw(400, 'Variant not found');
        }

        const ext = request.ext;
        const engine = request.engine;
        const context = request.context || {};
        const result = ctx.fractal.render(variant, context, {ext, engine}).then(output => {
          return {
            requestData: request,
            // TODO: Figure out why toJSON methods are so slow and re-instate the props below
            // component: component.toJSON(),
            // variant: variant.toJSON(),
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
