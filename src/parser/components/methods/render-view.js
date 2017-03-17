const assert = require('check-types').assert;
const File = require('@frctl/ffs').File;

module.exports = function (fractal) {
  return {

    name: 'renderView',

    handler(view, context, callback) {
      assert.instance(view, File, `components.renderView: view must be a File instance [view-invalid]`);
      assert.object(context, `components.renderView: context must be an object [context-invalid]`);
      assert.function(callback, `components.renderView: callback must be a function [callback-invalid]`);

      if (!fractal.defaultAdapter) {
        throw new Error(`components.renderView: You must specify one or more view engine adapters [no-adapters]`);
      }

      if (!view.adapter) {
        throw new Error(`The view provided does not have a valid 'adapter' property [no-adapter-specified]`);
      }
      if (!fractal.adapters.has(view.adapter)) {
        throw new Error(`No matching adapter found for '${view.adapter}' [adapter-not-found]`);
      }
      return this.render[view.adapter](view, context, callback);
    }

  };
};
