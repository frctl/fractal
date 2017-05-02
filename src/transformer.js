const _ = require('lodash');
const Collection = require('./collection');
const Methods = require('./methods');
const Plugins = require('./plugins');
const validate = require('./validate');

const state = new WeakMap();

class Transformer {

  constructor(opts = {}) {
    validate.transform(opts);
    state.set(this, null);
    this.name = opts.name;
    this.plugins = opts.plugins || new Plugins();
    this.methods = opts.methods || new Methods();
    this.transform = opts.transformer;
  }

  get state() {
    return state.get(this);
  }

  set state(result) {
    if (!(result instanceof Collection)) {
      throw new TypeError(`Transform state must be a 'Collection' instance`);
    }
    state.set(this, result);
    return this;
  }

  run(files, context) {
    const items = this.transform(files);
    return this.plugins.process(items, context).then(result => {
      const collection = new Collection(result);
      // bind methods to the collection
      for (const method of this.methods) {
        _.set(collection, method.name, method.handler.bind(collection));
      }
      this.state = collection;
      return collection;
    });
  }

}

module.exports = Transformer;
