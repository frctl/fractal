/* eslint no-unused-expressions: "off", guard-for-in: "off" */
const {EventEmitter2} = require('eventemitter2');
const {expect, sinon} = require('../../../../test/helpers');
const EmittingPromise = require('./emitting-promise');

const basicResolver = (resolve, reject) => resolve('value');
const resolver = (resolve, reject, emitter) => {
  try {
    emitter.emit('transform.start', 'initial value');
    setTimeout(() => {
      emitter.emit('transform.end', 'final value');
      resolve('very final value');
    }, 200);
  } catch (err) {
    reject(err);
  }
};

describe('EmittingPromise', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const eProm = new EmittingPromise(basicResolver);
      expect(eProm).to.exist;
      expect(eProm).to.be.an.instanceof(Promise);
      return eProm;
    });
    it('passes expected params to the resolver', function () {
      const eProm = new EmittingPromise((resolve, reject, emitter) => {
        expect(resolve).to.be.a('function');
        expect(reject).to.be.a('function');
        expect(emitter).to.be.instanceOf(EventEmitter2);
        resolve('value');
      });

      return eProm;
    });
    it('supports passing a custom emitter instance', function () {
      const customEmitter = new EventEmitter2();
      const eProm = new EmittingPromise((resolve, reject, emitter) => {
        expect(emitter).to.equal(customEmitter);
        resolve('value');
      }, customEmitter);
      return eProm;
    });
    it('proxies to its emitter properly', function () {
      const eventEmitter = new EventEmitter2({
        wildcard: true
      });
      const eProm = new EmittingPromise(basicResolver);
      const spies = {};
      for (let prop in eventEmitter) {
        if (typeof Reflect.get(eventEmitter, prop) === 'function') {
          spies[prop] = sinon.spy(EventEmitter2.prototype, prop);
        }
      }
      for (let prop in eventEmitter) {
        if (prop === 'emit') {
          continue;
        }
        const proxied = Reflect.get(eProm, prop);
        expect(proxied).to.exist;
        expect(typeof Reflect.get(eventEmitter, prop)).to.equal(typeof proxied);
        if (typeof proxied === 'function') {
          try {
            proxied.call(eProm);
          } catch (err) {}
          expect(spies[prop].called).to.be.true;
        }
      }
    });
  });
  describe('.on()', function () {
    it('emits events and resolves as expected', function () {
      let counter = 0;
      const eProm = new EmittingPromise(resolver);
      eProm.on('transform.start', result => {
        expect(result).to.equal('initial value');
        counter++;
      }).on('transform.end', function (result) {
        expect(result).to.equal('final value');
        counter++;
      }).catch(err => console.log(err)).then(() => {
        expect(counter).to.equal(2);
      });
      return eProm;
    });
  });
  describe('.then()', function () {
    it('resolves as expected', function () {
      const eProm = new EmittingPromise(resolver);

      eProm.then(result => {
        expect(result).to.equal('very final value');
      }).catch(err => console.log(err));

      return eProm;
    });
  });
  describe('.reject()/.catch()', function () {
    it('rejects as expected on catch prop', function () {
      return new EmittingPromise((resolve, reject) =>
          reject(new Error('failed to deliver on my promise to you')))
        .catch(err => {
          expect(err).to.exist;
        });
    });
    it('rejects as expected as second param', function () {
      return new EmittingPromise((resolve, reject) =>
          reject(new Error('failed to deliver on my promise to you')))
        .then(res => {
          console.log(res);
        }, err => {
          expect(err).to.exist;
        });
    });
  });
  describe('emitting and resolving', function () {
    it('combines functions successfully', function () {
      const eProm = new EmittingPromise(resolver);

      eProm.on('transform.start', result => {
        expect(result).to.equal('initial value');
      }).on('transform.end', function (result) {
        expect(result).to.equal('final value');
      }).then(result => {
        expect(result).to.equal('very final value');
      }).catch(err => console.log(err));

      return eProm;
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const eProm = new EmittingPromise(resolver);
      expect(eProm[Symbol.toStringTag]).to.equal('EmittingPromise');
      return eProm;
    });
  });
});
