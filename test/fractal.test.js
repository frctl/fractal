/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const EventEmitter = require('eventemitter2').EventEmitter2;
const expect = require('@frctl/utils/test').expect;
const sinon = require('sinon');
const Fractal = require('../src/fractal');
// const Plugins = require('../src/plugins');
// const Methods = require('../src/methods');
// const Adapters = require('../src/adapters');
const Collection = require('../src/collection');

// const collections = ['files', 'components'];
const validConfig = {
  src: './test/fixtures/components',
  presets: [
    '@frctl/presets/core'
  ]
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

    it(`inherits from EventEmitter`, function () {
      expect(new Fractal({})).to.be.instanceof(EventEmitter);
    });
  });

  // describe('.addPlugin()', function () {
  //   it(`checks the plugin is valid`);
  //
  //   it(`adds the plugin to the appropriate plugin set`, function () {
  //     const fractal = new Fractal(validConfig);
  //     for (const entity of collections) {
  //       const plugins = fractal.transforms.get(entity).plugins;
  //       const plugin = sinon.spy();
  //       expect(plugins.toArray().includes(plugin)).to.be.false;
  //       fractal.addPlugin(plugin, entity);
  //       expect(plugins.toArray().includes(plugin)).to.be.true;
  //     }
  //   });
  //
  //   it(`adds the plugin to the components parser if a target parser is not specified`, function () {
  //     const fractal = new Fractal(validConfig);
  //     const plugins = fractal.transforms.get('components').plugins;
  //     const plugin = sinon.spy();
  //     expect(plugins.toArray().includes(plugin)).to.be.false;
  //     fractal.addPlugin(plugin);
  //     expect(plugins.toArray().includes(plugin)).to.be.true;
  //   });
  // });
  //
  // describe('.addMethod()', function () {
  //   it(`checks the method is valid`);
  //
  //   it(`adds the method to the target interface`, function () {
  //     const fractal = new Fractal(validConfig);
  //     for (const entity of collections) {
  //       const methods = fractal.transforms.get(entity).methods;
  //       const methodName = `${entity}Test`;
  //       const method = sinon.spy();
  //       fractal.addMethod(methodName, method, entity);
  //       expect(Boolean(methods.toArray().find(mth => mth.name === methodName))).to.be.true;
  //     }
  //   });
  //
  //   it(`adds the method to the components interface if a target interface is not specified`, function () {
  //     const fractal = new Fractal(validConfig);
  //     const methods = fractal.transforms.get('components').methods;
  //     const methodName = `componentsTest`;
  //     const method = sinon.spy();
  //     fractal.addMethod(methodName, method);
  //     expect(Boolean(methods.toArray().find(mth => mth.name === methodName))).to.be.true;
  //   });
  // });

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

  describe('.addCommand()', function () {
    it(`checks the command is valid`);
  });

  describe('.parse()', function () {
    it('calls the callback with collections when successful ', function (done) {
      const fractal = new Fractal(validConfig);
      fractal.parse((err, state) => {
        console.log(err);
        expect(err).to.equal(null);
        expect(state.components).to.be.instanceOf(Collection);
        expect(state.files).to.be.instanceOf(Collection);
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
      fractal.parse(() => {
        expect(startSpy.called).to.be.true;
        done();
      });
    });

    it('emits a `parse.start` event when starting', function (done) {
      const fractal = new Fractal();
      fractal.on('parse.complete', function () {
        expect(true).to.be.true;
      });
      fractal.parse(done);
    });

    // it('processes all the entities in order', function (done) {
    //   const fractal = new Fractal();
    //   const stub = sinon.stub(fractal, 'process', function () {
    //     return Promise.resolve({
    //       toArray: function () {
    //         return [];
    //       }
    //     });
    //   });
    //   fractal.parse(() => {
    //     expect(stub.callCount).equals(entities.length);
    //     let i = 0;
    //     for (const entity of entities) {
    //       expect(stub.calledWith(entity)).to.be.true;
    //       expect(stub.getCall(i).calledWith(entity)).to.be.true;
    //       i++;
    //     }
    //     done();
    //   });
    // });
  });

  // describe('.files', function () {
  //   it(`provides access to the files object`, function () {
  //     const fractal = new Fractal(validConfig);
  //     expect(fractal.files).to.be.an('object');
  //     expect(fractal.files.plugins).to.be.an.instanceof(Plugins);
  //     expect(fractal.files.methods).to.be.an.instanceof(Methods);
  //   });
  // });
  //
  // describe('.components', function () {
  //   it(`provides access to the components object`, function () {
  //     const fractal = new Fractal(validConfig);
  //     expect(fractal.components).to.be.an('object');
  //     expect(fractal.components.plugins).to.be.an.instanceof(Plugins);
  //     expect(fractal.components.methods).to.be.an.instanceof(Methods);
  //   });
  // });
});
