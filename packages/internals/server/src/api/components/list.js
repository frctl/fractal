module.exports = function () {
  return {

    method: 'get',

    path: '/components',

    async handler(ctx, next) {
      const components = await ctx.fractal.getComponents();
      ctx.body = components.mapToArray(component => {
        return {
          id: component.id,
          variants: component.getVariants().mapToArray(variant => {
            return {
              id: variant.id
            };
          })
        };
      });
    }

  };
};
