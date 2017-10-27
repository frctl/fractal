const {EventEmitter2} = require('eventemitter2');

const _namespace = new WeakMap();

class Emitter extends EventEmitter2 {
  constructor(opts = {}) {
    super({
      wildcard: true
    });
    if (opts.namespace) {
      _namespace.set(this, opts.namespace);
    }
  }

  get namespace() {
    return _namespace.get(this);
  }
}

module.exports = Emitter;
