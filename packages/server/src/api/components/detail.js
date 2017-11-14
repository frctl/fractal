module.exports = function () {
  return {

    method: 'get',

    path: '/components/:component',

    async handler(ctx, next) {
      const component = ctx.components.find(ctx.params.component);
      if (!component) {
        ctx.throw(404, 'Component not found');
      }
      ctx.body = component.toJSON();
    }

  };
};
