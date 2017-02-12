/* eslint no-unused-expressions : "off" */

const expect = require('@frctl/utils/test').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const configure = require('../src/configure');

const configSpy = sinon.spy();
const fractal = proxyquire('../src/index', {
  './configure': function (...args) {
    configSpy(...args);
    return configure(...args);
  }
});

const validConfig = {
  components: {
    src: './fixtures/components'
  }
};

describe('fractal', function () {
  beforeEach(function () {
    configSpy.reset();
  });

  it('exports a function', function () {
    expect(fractal).to.be.a('function');
  });

  it(`throws an error if invalid config is passed in`, function () {
    for (const type of ['string', [], 123]) {
      expect(() => fractal(type)).to.throw(TypeError, `[config-invalid]`);
    }
  });

  it(`does not throw an error if a valid config object is passed in`, function () {
    expect(() => fractal(validConfig)).to.not.throw(TypeError, `[config-invalid]`);
  });

  it(`calls the configure module with the supplied configuration`, function () {
    fractal(validConfig);
    expect(configSpy.calledWith(validConfig)).to.be.true;
  });
});
