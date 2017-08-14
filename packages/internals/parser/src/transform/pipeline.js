// const debug = require('debug')('fractal:parser');

const _transforms = new WeakMap();

class Pipeline {
  constructor(transformers = []) {
    _transforms.set(this, []);
  }

  get transforms() {
    // _transforms.set(this, sortBy(_transforms.get(this), 'priority'));
    return _transforms.get(this).slice(0);
  }
}

module.exports = Pipeline;
