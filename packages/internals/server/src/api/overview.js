module.exports = function () {
  return {

    method: 'get',

    path: '/',

    async handler(ctx, next) {
      ctx.body = {
        fractal: {
          version: ctx.fractal.version
        }
      };
    }

  };
};
