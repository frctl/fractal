const {EventEmitter2} = require('eventemitter2');
const assert = require('check-types').assert;

class EmittingPromise extends Promise {
  constructor(resolver) {
    assert.function(resolver, `EmittingPromise constructor requires a resolver with params 'resolve, reject [, emit]' [invalid-resolver]`);
    const emitter = new EventEmitter2();

    super((resolve, reject) => {
      resolver(resolve, reject, (eventName, ...args) => {
        process.nextTick(() => {
          emitter.emit(eventName, ...args);
        });
      });
    });
    this.emitter = emitter;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          var value = target[prop];
          return typeof value === 'function' ? value.bind(target) : value;
        } else if (prop in emitter) {
          return Reflect.get(emitter, prop);
        }
      }
    });
  }
}
module.exports = EmittingPromise;
