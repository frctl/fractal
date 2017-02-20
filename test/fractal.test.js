/* eslint no-unused-expressions : "off" */

const expect = require('@frctl/utils/test').expect;
const proxyquire = require('proxyquire');
// const sinon = require('sinon');

// const configSpy = sinon.spy();
const Fractal = proxyquire('../fractal', {});

const validConfig = {
  src: './fixtures/components'
};

describe('new Fractal()', function () {

  it(`throws an error if invalid config is passed in`, function () {
    for (const type of ['string', [], 123]) {
      const fr = new Fractal(type);
      expect(() => fr).to.throw(TypeError, `[config-invalid]`);
    }
  });

  it(`does not throw an error if a valid config object is passed in`, function () {
    expect(() => new Fractal(validConfig)).to.not.throw(TypeError, `[config-invalid]`);
  });

  describe('.api', function () {

    it(`does not throw an error if a valid config object is passed in`, function () {
      expect(() => new Fractal(validConfig)).to.not.throw(TypeError, `[config-invalid]`);
    });

  });

});
