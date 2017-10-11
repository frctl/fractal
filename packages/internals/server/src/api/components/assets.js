module.exports = function () {
  return {

    method: 'get',

    path: '/components/:component/assets',

    async handler(ctx, next) {
      const components = await ctx.fractal.getComponents();
      const component = components.find(ctx.params.component);
      if (!component) {
        ctx.status = 404;
        return;
      }

      // TODO: proper asset build step
      const output = {};
      for (const ext of ['.js','.css']) {
        const type = ext.replace('.','');
        const files = component.getFiles().filter('extname', ext);
        if (files.length) {
          output[type] = files.mapToArray(f => f.contents).join('\n');
        } else {
          output[type] = null;
        }
      }

      ctx.body = output;
    }

  };
};
