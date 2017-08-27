/* eslint no-unused-expressions: "off" */
const proxyquire = require('proxyquire');
const {EventEmitter2} = require('eventemitter2');
const {expect, sinon} = require('../../../../test/helpers');
const Emitter = require('./emitter');

describe('Emitter', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Emitter with expected superclass`, function () {
      const emitter = new Emitter();
      expect(emitter).to.exist;
      expect(emitter instanceof Emitter).to.be.true;
      expect(emitter instanceof EventEmitter2).to.be.true;
    });
    it('calls superclass constructor with expected properties', function () {
      const spy = sinon.spy();
      const Emitter = proxyquire('./emitter', {
        eventemitter2: {EventEmitter2: spy}
      });
      const emitter = new Emitter();
      expect(emitter).to.exist;
      expect(spy.args[0][0]).to.eql({wildcard: true});
    });
    it('sets the namespace correctly', function () {
      const emitter = new Emitter({namespace: '@ns'});
      expect(emitter.namespace).to.equal('@ns');
    });
  });
});
