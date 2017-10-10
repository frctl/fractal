module.exports = function () {
  return {

    method: 'get',

    path: '/components',

    async handler(ctx, next) {
      const components = await ctx.fractal.getComponents();
      ctx.body = components.mapToArray(component => {
        const componentData = component.getProps();
        componentData.variants = component.getVariants().toJSON();
        return componentData;
      });
    }

  };
};
