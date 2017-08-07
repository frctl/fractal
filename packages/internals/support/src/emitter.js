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

  /**
   * Convenience function for emitting a log events
   *
   * @param  {string} message The message string
   * @param  {object|string} opts level string or options object
   * @return {Fractal} The Fractal instance
   */
  log(message, opts = {}) {
    opts = typeof opts === 'string' ? {level: opts} : opts;
    const namespace = opts.namespace || _namespace.get(this);
    opts.level = opts.level || 'debug';
    if (namespace) {
      opts.namespace = namespace;
    }
    this.emit(`log.${opts.level}`, message, opts);
    return this;
  }
}

module.exports = Emitter;
