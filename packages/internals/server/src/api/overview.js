module.exports = function () {
  return {

    method: 'get',

    path: '/',

    async handler(ctx, next) {
      ctx.body = {
        message: 'Fractal component API server',
        fractal: {
          version: ctx.fractal.version
        }
      };
    }

  };
};
