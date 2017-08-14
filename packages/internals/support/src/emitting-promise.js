/* eslint guard-for-in: "off" */
const {EventEmitter2} = require('eventemitter2');
const assert = require('check-types').assert;

class EmittingPromise extends Promise {
  constructor(resolver) {
    assert.function(resolver, `EmittingPromise constructor requires a resolver with params 'resolve, reject [, emit]' [invalid-resolver]`);
    const emitter = new EventEmitter2({
      wildcard: true
    });

    super((resolve, reject) => {
      resolver(resolve, reject, (eventName, ...args) => {
        process.nextTick(() => {
          emitter.emit(eventName, ...args);
        });
      });
    });

    for (let prop in emitter) {
      Reflect.defineProperty(this, prop, {
        get: function () {
          return Reflect.get(emitter, prop);
        },
        set: function (value) {
          return Reflect.set(emitter, prop, value);
        },
        enumerable: true
      });
    }

    this.emitter = emitter;
  }
}
module.exports = EmittingPromise;
