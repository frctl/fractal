module.exports = function () {
  return {
    name: 'engines',
    transform: 'components',
    handler: function name(components, state, app) {
      const engines = app.getRenderer().getEngines();
      components.forEach(component => {
        component.getViews().forEach(view => {
          for (const engine of engines) {
            if (engine.match(view.basename)) {
              view.engine = engine.name;
              break;
            }
          }
        });
        component.getVariants().forEach(variant => {
          variant.getViews().forEach(template => {
            for (const engine of engines) {
              if (engine.match(template.basename)) {
                template.engine = engine.name;
                break;
              }
            }
          });
        });
      });
      return components;
    }
  };
};
