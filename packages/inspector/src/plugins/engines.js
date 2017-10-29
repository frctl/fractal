module.exports = function () {
  return {
    name: 'inspector-view-engines',
    transform: 'components',
    handler: function name(components, state, app) {
      const engines = app.getRenderer().getEngines();
      components.forEach(component => {
        component.getViews().forEach(view => {
          view.inspector = view.inspector || {};
          for (const engine of engines) {
            if (engine.match(view.basename)) {
              view.inspector.engine = engine.name;
              break;
            }
          }
        });
      });
      return components;
    }
  };
};
