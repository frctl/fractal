/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const EventEmitter = require('eventemitter2').EventEmitter2;
const SourceSet = require('@frctl/internals').SourceSet;
const Source = require('@frctl/internals').Source;
const utils = require('@frctl/utils');
const expect = require('@frctl/utils/test').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const merge = require('../src/parser/merge');
const defaults = require('../config');

const Fractal = proxyquire('../src/fractal', {});

const validConfig = {
  src: './test/fixtures/components'
};

describe('Fractal', function () {
  describe('constructor()', function () {
    it(`throws an error if invalid config is passed in`, function () {
      for (const type of ['string', [], 123]) {
        const fr = () => (new Fractal(type));
        expect(fr).to.throw(TypeError, `[config-invalid]`);
      }
    });

    it(`does not throw an error if a valid config object is passed in`, function () {
      expect(() => new Fractal(validConfig)).to.not.throw(TypeError, `[config-invalid]`);
    });

    it(`does not require a src property to be set`, function () {
      expect(() => new Fractal({})).to.not.throw(TypeError, `[config-invalid]`);
    });

    it('merges supplied config with the configuration defaults set', function () {
      const config = {};
      const fractal = new Fractal(config);
      const merged = utils.defaultsDeep(config || {}, defaults);
      expect(merged).to.eql(fractal.config);
    });

    it(`supports setting of the initial state via config`, function () {
      const state = {
        files: [{}],
        components: [{}],
        collections: [{}]
      };
      const fractal = new Fractal({
        initialState: state
      });
      expect(fractal.state.$data).to.eql(state);
    });

    it(`adds a default Source if the src property is specified`, function () {
      const sourceSet = new SourceSet();
      const stub = sinon.stub(sourceSet, 'addSource');
      const fractal = new Fractal({
        src: './test/fixtures/components',
        sources: sourceSet
      });
      if (fractal) {
        expect(stub.called).to.be.true;
      }
    });

    it(`inherits from EventEmitter`, function () {
      expect(new Fractal({})).to.be.instanceof(EventEmitter);
    });
  });

  describe('.state', function () {
    it(`provides access to a library API object`, function () {
      const fractal = new Fractal(validConfig);
      expect(fractal.state).to.have.property('$data');
    });

    it(`provides a new library API instance on each subsequent retrieval`, function () {
      const fractal = new Fractal(validConfig);
      const first = fractal.state;
      const second = fractal.state;
      expect(first).to.not.equal(second);
    });
  });

  describe('.adapters', function () {
    it(`provides an array of registered adapter names`, function () {
      const fractal = new Fractal(validConfig);
      fractal.addAdapter('nunjucks');
      expect(fractal.adapters).to.be.an('array');
      expect(fractal.adapters.length).to.equal(1);
    });
  });

  describe('.addPlugin()', function () {
    it(`throws an error if called with invalid arguments`, function () {
      const fractal = new Fractal(validConfig);
      expect(() => fractal.addPlugin()).to.throw(TypeError, `[plugin-invalid]`);
      expect(() => fractal.addPlugin(123)).to.throw(TypeError, `[plugin-invalid]`);
      expect(() => fractal.addPlugin(() => {}, 123)).to.throw(TypeError, `[stack-invalid]`);
      expect(() => fractal.addPlugin(() => {})).to.not.throw(TypeError, `[plugin-invalid]`);
      expect(() => fractal.addPlugin(() => {}, 'files')).to.not.throw(TypeError, `[stack-invalid]`);
    });

    it(`adds a plugin to the source set`, function () {
      const sourceSet = new SourceSet();
      const stub = sinon.stub(sourceSet, 'addPlugin');
      const fractal = new Fractal({
        src: './test/fixtures/components',
        sources: sourceSet
      });
      const plugin = () => {};
      fractal.addPlugin(plugin);
      expect(stub.called).to.be.true;
      expect(stub.calledWith(plugin)).to.be.true;
    });

    it(`defaults to applying the plugin to the components stack if another is not specified`, function () {
      const sourceSet = new SourceSet();
      const stub = sinon.stub(sourceSet, 'addPlugin');
      const fractal = new Fractal({
        src: './test/fixtures/components',
        sources: sourceSet
      });
      const plugin = () => {};
      fractal.addPlugin(plugin);
      expect(stub.calledWith(plugin, 'components')).to.be.true;
    });
  });

  describe('.addMethod()', function () {
    it(`throws an error if called with invalid arguments`, function () {
      const fractal = new Fractal(validConfig);
      expect(() => fractal.addMethod(123)).to.throw(TypeError, `[name-invalid]`);
      expect(() => fractal.addMethod('foo', [])).to.throw(TypeError, `[handler-invalid]`);
      expect(() => fractal.addMethod('foo', () => {})).to.not.throw(TypeError, `[name-invalid]`);
      expect(() => fractal.addMethod('foo', () => {})).to.not.throw(TypeError, `[handler-invalid]`);
    });

    it(`makes a method available on the source API object`, function () {
      const fractal = new Fractal(validConfig);
      expect(fractal.state.foobar).to.be.undefined;
      fractal.addMethod('foobar', () => {});
      expect(fractal.state.foobar).to.be.a('function');
    });
  });

  describe('.addExtension()', function () {
    it(`throws an error if called with invalid arguments`, function () {
      const fractal = new Fractal(validConfig);
      expect(() => fractal.addExtension(123)).to.throw(TypeError, `[extension-invalid]`);
      expect(() => fractal.addExtension('foobar')).to.throw(TypeError, `[extension-invalid]`);
      expect(() => fractal.addExtension(() => {})).to.not.throw(TypeError, `[extension-invalid]`);
    });

    it(`passes the fractal instance to the extension when registered`, function () {
      const fractal = new Fractal(validConfig);
      const extension = sinon.spy();
      fractal.addExtension(extension);
      expect(extension.calledWith(fractal)).to.be.true;
    });
  });

  describe('.addSource()', function () {
    it(`adds the source to the SourceSet`, function () {
      const sourceSet = new SourceSet();
      const stub = sinon.stub(sourceSet, 'addSource');
      const fractal = new Fractal({
        src: './test/fixtures/components',
        sources: sourceSet
      });
      const source = {
        src: '/foo/bar'
      };
      fractal.addSource(source);
      expect(stub.called).to.be.true;
      expect(stub.calledWith(source)).to.be.true;
      stub.reset();
      const source2 = new Source();
      fractal.addSource(source2);
      expect(stub.called).to.be.true;
      expect(stub.calledWith(source2)).to.be.true;
    });
  });

  describe('.parse()', function () {
    it('returns a Promise if no callback is provided', function () {
      const fractal = new Fractal();
      return expect(fractal.parse()).to.eventually.be.resolved;
    });

    it('rejects the Promise if an error occurs', function () {
      const fractal = new Fractal({
        src: 'doesnt/exist'
      });
      return expect(fractal.parse()).to.eventually.be.rejected;
    });

    it('calls the callback (if provided) with success arguments when successful', function (done) {
      const fractal = new Fractal(validConfig);
      fractal.parse((err, library) => {
        expect(err).to.equal(null);
        expect(library).to.have.property('$data');
        done();
      });
    });

    it('calls the callback (if provided) with an error argument when parsing fails', function (done) {
      const fractal = new Fractal({
        src: '/doesnt/exist'
      });
      fractal.parse(err => {
        expect(err).to.be.instanceof(Error);
        done();
      });
    });

    it('emits a `parse.start` event when starting', function (done) {
      const fractal = new Fractal();
      const startSpy = sinon.spy();
      fractal.on('parse.start', startSpy);
      fractal.parse(done);
      expect(startSpy.called).to.be.true;
    });

    it('emits a `parse.complete` event when finished', function (done) {
      const fractal = new Fractal();
      const endSpy = sinon.spy();
      fractal.on('parse.complete', endSpy);
      fractal.parse(() => {
        expect(endSpy.called).to.be.true;
        done();
      });
    });

    it('resolves (promise or callback) immediately if no sources have been registered', function (done) {
      const sourceSet = new SourceSet();
      const stub = sinon.stub(sourceSet, 'parse', function () {
        return Promise.resolve({});
      });
      const fractal = new Fractal({
        sources: sourceSet
      });
      const state = fractal.state;
      fractal.parse((err, library) => {
        expect(library.$data).to.eql(state.$data);
        expect(stub.called).to.be.false;
        done();
      });
    });

    it('delegates parsing to the source set', function (done) {
      const sourceSet = new SourceSet();
      const stub = sinon.stub(sourceSet, 'parse', function () {
        return Promise.resolve({});
      });
      const fractal = new Fractal({
        src: './test/fixtures/components',
        sources: sourceSet
      });
      fractal.parse(() => {
        expect(stub.called).to.be.true;
        done();
      });
    });

    it('resolves (promise or callback) with a library API instance', function (done) {
      const fractal = new Fractal();
      fractal.parse((err, library) => {
        expect(library).to.be.an('object');
        expect(library).to.have.property('$data');
        done();
      });
    });

    it('uses the merge module results from all sources together', function (done) {
      let called = false;
      const ProxyFractal = proxyquire('../src/fractal', {
        './parser/merge': function (...args) {
          called = true;
          return merge(...args);
        }
      });
      const fractal = new ProxyFractal(validConfig);
      fractal.parse(() => {
        expect(called).to.be.true;
        done();
      });
    });
  });

  describe('library API instance', function () {
    it('has the expected properties', function (done) {
      const fractal = new Fractal();
      fractal.parse((err, library) => {
        expect(library).to.be.an('object');
        expect(library).to.have.property('components');
        expect(library).to.have.property('files');
        expect(library).to.have.property('collections');
        expect(library.collections).to.be.an('array');
        expect(library.files).to.be.an('array');
        expect(library.components).to.be.an('array');
        done();
      });
    });
  });
});
