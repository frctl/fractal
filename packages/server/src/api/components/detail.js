module.exports = function () {
  return {

    method: 'get',

    path: '/components/:component',

    async handler(ctx, next) {
      const components = await ctx.fractal.getComponents();
      const component = components.find(ctx.params.component);
      if (!component) {
        ctx.status = 404;
        return;
      }
      ctx.body = component.toJSON();
    }

  };
};
