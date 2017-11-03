module.exports = function () {
  return {

    method: 'get',

    path: '/components',

    async handler(ctx, next) {
      ctx.body = ctx.components.mapToArray(component => {
        const componentData = component.getProps();
        componentData.variants = component.getVariants().toJSON();
        return componentData;
      });
    }

  };
};
