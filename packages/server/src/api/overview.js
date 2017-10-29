module.exports = function () {
  return {

    method: 'get',

    path: '/',

    async handler(ctx, next) {
      ctx.body = {
        message: 'Fractal component API server',
        fractal: {
          version: ctx.fractal.version,
          engines: ctx.fractal.getRenderer().getEngines().map(engine => ({
            name: engine.name,
            label: engine.label
          })),
          plugins: ctx.fractal.get('plugins').map(plugin => ({
            name: plugin.name,
            transform: plugin.transform
          }))
        }
      };
    }

  };
};
