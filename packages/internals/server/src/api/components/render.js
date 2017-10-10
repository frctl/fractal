const {defaultsDeep} = require('@frctl/utils');
const koaBody = require('koa-body');

module.exports = function () {
  return {

    method: 'post',

    path: '/components/render',

    middleware: koaBody(),

    async handler(ctx, next) {
      const app = ctx.fractal;
      const components = await app.getComponents();

      const payload = ctx.request.body || [];

      if (!Array.isArray(payload)) {
        ctx.status = 400;
        return;
      }

      const pending = [];
      console.log('-----');

      for (const request of payload) {

        console.log(request);
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
          }
        });
        pending.push(result);
      }

      ctx.body = await Promise.all(pending);
    }
  };
};
