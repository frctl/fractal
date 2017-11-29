module.exports = function () {
  return {

    method: 'get',

    path: '/components',

    async handler(ctx, next) {
      ctx.body = ctx.components.toJSON();
    }

  };
};
