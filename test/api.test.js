/* eslint no-unused-expressions : "off", handle-callback-err: "off", new-cap: "off" */

const Api = require('@frctl/internals').Api;
const expect = require('@frctl/utils/test').expect;
// const sinon = require('sinon');
const api = require('../src/api');
const Fractal = require('../src/fractal');

const dummyData = {
  components: [],
  collections: [],
  files: []
};

describe('api()', function () {
  it(`returns an Api instance`, function () {
    const frctl = new Fractal();
    expect(api(frctl)).to.be.instanceof(Api);
  });

  it(`adds the expected API properties`, function () {
    const frctl = new Fractal();
    const lib = api(frctl).from(dummyData);
    expect(lib.components).to.be.an('array');
    expect(lib.collections).to.be.an('array');
    expect(lib.files).to.be.an('array');
    expect(lib.$data).to.equal(dummyData);
  });
});
