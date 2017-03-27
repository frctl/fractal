/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const _ = require('lodash');
const expect = require('@frctl/utils/test').expect;
const sinon = require('sinon');
const Fractal = require('../src/fractal');
const factory = require('../.');

const adapterObject = {
  name: 'test',
  match: '.test',
  render() {}
};

describe('Fractal instance factory', function () {
  it(`returns a Fractal instance`, function () {
    expect(factory({})).to.be.instanceof(Fractal);
  });

  it(`converts adapter config into valid adapters`, function () {
    const specs = [
      [
        'nunjucks',
        adapterObject,
        './test/fixtures/packages/adapter'
      ],
      {
        nunjucks: {},
        test: adapterObject,
        './test/fixtures/packages/adapter': {}
      }
    ];

    for (let adapters of specs) {
      let fractal = new Fractal();
      const stub = sinon.stub(fractal, 'addAdapter');
      fractal = factory({
        adapters: adapters
      }, fractal);
      expect(stub.calledThrice).to.be.true;
      expect(stub.getCall(0).args[0].name).to.equal('nunjucks');
      expect(stub.getCall(1).args[0].name).to.equal('test');
      expect(stub.getCall(2).args[0].name).to.equal('faux-adapter');
    }
  });

  it(`converts plugin config into valid plugins`, function () {
    let fractal = new Fractal();
    const filesUse = sinon.stub(fractal.files.parser, 'use');
    const componentsUse = sinon.stub(fractal.components.parser, 'use');
    fractal = factory({
      plugins: {
        files: [
          './test/fixtures/packages/plugin',
          function anotherTestPlugin() {}
        ],
        components: {
          './test/fixtures/packages/plugin': {},
          anotherTestPlugin: function () {}
        }
      }
    }, fractal);
    expect(filesUse.calledTwice).to.be.true;
    expect(componentsUse.calledTwice).to.be.true;
    expect(filesUse.getCall(0).args[0].name).to.equal('testPlugin');
    expect(filesUse.getCall(1).args[0].name).to.equal('anotherTestPlugin');
    expect(componentsUse.getCall(0).args[0].name).to.equal('testPlugin');
    expect(componentsUse.getCall(1).args[0].name).to.equal('anotherTestPlugin');
  });

  it(`converts extension config into valid extensions`, function () {
    let fractal = new Fractal();
    const stub = sinon.stub(fractal, 'addExtension');
    fractal = factory({
      extensions: [
        function () {},
        './test/fixtures/packages/extension'
      ]
    }, fractal);
    expect(stub.calledTwice).to.be.true;
    expect(stub.getCall(0).args[0]).to.be.a('function');
    expect(stub.getCall(1).args[0]).to.be.a('function');
  });
});
