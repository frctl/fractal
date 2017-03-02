/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const EventEmitter = require('eventemitter2').EventEmitter2;
const utils = require('@frctl/utils');
const expect = require('@frctl/utils/test').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const defaults = require('../config');

const entities = ['files', 'components'];
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

    it(`inherits from EventEmitter`, function () {
      expect(new Fractal({})).to.be.instanceof(EventEmitter);
    });
  });

  describe('.parsers', function () {
    it(`provides access to the set of available parsers`, function () {
      const fractal = new Fractal(validConfig);
      expect(fractal.parsers).to.be.instanceof(Map);
      expect(fractal.parsers.get('files')).to.be.a('function');
      expect(fractal.parsers.get('components')).to.be.a('function');
    });
  });

  describe('.interfaces', function () {
    it(`provides access to the set of interface generators`, function () {
      const fractal = new Fractal(validConfig);
      expect(fractal.interfaces).to.be.instanceof(Map);
      expect(fractal.interfaces.get('files')).to.be.a('function');
      expect(fractal.interfaces.get('components')).to.be.a('function');
    });
  });

  describe('.adapters', function () {
    it(`provides an array of registered adapters`, function () {
      const fractal = new Fractal(validConfig);
      fractal.addAdapter('nunjucks');
      expect(fractal.adapters).to.be.instanceof(Map);
      expect(fractal.adapters.size).to.equal(1);
    });
  });

  describe('.addPlugin()', function () {
    it(`throws an error if called with invalid arguments`, function () {
      const fractal = new Fractal(validConfig);
      expect(() => fractal.addPlugin()).to.throw(TypeError, `[plugin-invalid]`);
      expect(() => fractal.addPlugin(123)).to.throw(TypeError, `[plugin-invalid]`);
      expect(() => fractal.addPlugin(() => {}, 123)).to.throw(TypeError, `[target-invalid]`);
      expect(() => fractal.addPlugin(() => {})).to.not.throw(TypeError, `[plugin-invalid]`);
      expect(() => fractal.addPlugin(() => {}, 'files')).to.not.throw(TypeError, `[target-invalid]`);
    });

    it(`adds the plugin to the appropriate parser`, function () {
      const fractal = new Fractal(validConfig);
      for (const entity of entities) {
        const parser = fractal.parsers.get(entity);
        const plugin = sinon.spy();
        expect(parser.plugins.includes(plugin)).to.be.false;
        fractal.addPlugin(plugin, entity);
        expect(parser.plugins.includes(plugin)).to.be.true;
      }
    });

    it(`adds the plugin to the components parser if a target parser is not specified`, function () {
      const fractal = new Fractal(validConfig);
      const parser = fractal.parsers.get('components');
      const plugin = sinon.spy();
      expect(parser.plugins.includes(plugin)).to.be.false;
      fractal.addPlugin(plugin);
      expect(parser.plugins.includes(plugin)).to.be.true;
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

    it(`adds the method to the target interface`, function () {
      const fractal = new Fractal(validConfig);
      for (const entity of entities) {
        const api = fractal.interfaces.get(entity);
        const methodName = `${entity}Test`;
        const method = sinon.spy();
        const data = {};
        expect(api(data)[methodName]).to.be.undefined;
        fractal.addMethod(methodName, method, entity);
        expect(api(data)[methodName]).to.be.a('function');
        api(data)[methodName]();
        expect(method.called).to.be.true;
      }
    });

    it(`adds the method to the components interface if a target interface is not specified`, function () {
      const fractal = new Fractal(validConfig);
      const api = fractal.interfaces.get('components');
      const methodName = `componentsTest`;
      const method = sinon.spy();
      const data = {};
      expect(api(data)[methodName]).to.be.undefined;
      fractal.addMethod(methodName, method);
      expect(api(data)[methodName]).to.be.a('function');
      api(data)[methodName]();
      expect(method.called).to.be.true;
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

  describe('.parse()', function () {
    it('throws an error if no callback is provided', function () {
      const fractal = new Fractal(validConfig);
      expect(fractal.parse).to.throw(TypeError, '[callback-invalid]');
    });

    it('calls the callback with success arguments when successful', function (done) {
      const fractal = new Fractal(validConfig);
      fractal.parse((err, library) => {
        expect(err).to.equal(null);
        expect(library).to.have.property('$data');
        done();
      });
    });

    it('calls the callback with an error argument when parsing fails', function (done) {
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

    it('processes all the entities in order', function (done) {
      const fractal = new Fractal();
      const stub = sinon.stub(fractal, 'process', function () {
        return Promise.resolve([]);
      });
      fractal.parse(() => {
        expect(stub.callCount).equals(entities.length);
        for (const entity of entities) {
          expect(stub.calledWith(entity)).to.be.true;
        }

        done();
      });
    });

    //
    // it('resolves (promise or callback) with a library API instance', function (done) {
    //   const fractal = new Fractal();
    //   fractal.parse((err, library) => {
    //     expect(library).to.be.an('object');
    //     expect(library).to.have.property('$data');
    //     done();
    //   });
    // });
  });
});
