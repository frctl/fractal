/* eslint no-unused-expressions: "off" */
const {EventEmitter2} = require('eventemitter2');
const {expect, sinon, mockRequire} = require('../../../../test/helpers');
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
      mockRequire('eventemitter2', {EventEmitter2: spy});
      const Emitter = mockRequire.reRequire('./emitter');
      const emitter = new Emitter();
      expect(emitter).to.exist;
      expect(spy.args[0][0]).to.eql({wildcard: true});
      mockRequire.stop('eventemitter2');
    });
    it('sets the namespace correctly', function () {
      const emitter = new Emitter({namespace: '@ns'});
      expect(emitter.namespace).to.equal('@ns');
    });
  });
  describe('.log()', function () {
    it('returns a reference to the emitter', function () {
      const emitter = new Emitter();
      const logged = emitter.log('Message');
      expect(emitter).to.equal(logged);
    });
    it('emits the provided message', function () {
      const emitter = new Emitter();
      const spy = sinon.spy(emitter, 'emit');
      emitter.log('Message');
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0]).to.eql(['log.debug', 'Message', {level: 'debug'}]);
    });
    it(`uses the Emitter's namespace when provided`, function () {
      const emitter = new Emitter({namespace: 'space'});
      const spy = sinon.spy(emitter, 'emit');
      emitter.log('Message');
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0]).to.eql(['log.debug', 'Message', {level: 'debug', namespace: 'space'}]);
    });
    it('emits the provided message when string options are provided', function () {
      const emitter = new Emitter();
      const spy = sinon.spy(emitter, 'emit');
      emitter.log('Message', 'error');
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0]).to.eql(['log.error', 'Message', {level: 'error'}]);
    });
    it('emits the provided message when object options are provided', function () {
      const emitter = new Emitter();
      const spy = sinon.spy(emitter, 'emit');
      emitter.log('Message', {level: 'fabulous', namespace: 'unicorn'});
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0]).to.eql(['log.fabulous', 'Message', {level: 'fabulous', namespace: 'unicorn'}]);
    });
    it('combines correctly when both inherited and immmediate options are provided', function () {
      const emitter = new Emitter({namespace: 'outer'});
      const spy = sinon.spy(emitter, 'emit');
      emitter.log('Message', 'error');
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0]).to.eql(['log.error', 'Message', {level: 'error', namespace: 'outer'}]);
    });
    it('overrides correctly when both inherited and immediate options are provided', function () {
      const emitter = new Emitter({namespace: 'outer'});
      const spy = sinon.spy(emitter, 'emit');
      emitter.log('Message', {level: 'warn', namespace: 'immediate'});
      expect(spy.calledOnce).to.be.true;
      expect(spy.args[0]).to.eql(['log.warn', 'Message', {level: 'warn', namespace: 'immediate'}]);
    });
  });
});
