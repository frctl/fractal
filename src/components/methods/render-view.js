module.exports = function (fractal) {
  return {

    name: 'renderView',

    handler(view, context, done) {
      if (!view.adapter) {
        throw new Error(`The view provided does not have a valid 'adapter' property`);
      }
      if (!fractal.adapters.has(view.adapter)) {
        throw new Error(`No matching adapter found for '${view.adapter}'`);
      }
      return this.render[view.adapter](view, context, done);
    }

  };
};
