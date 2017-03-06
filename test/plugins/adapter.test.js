/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const expect = require('@frctl/utils/test').expect;
const adapterFactory = require('../../src/files/plugins/adapter');

describe('Adapter Plugin', function () {
  describe('constructor', function () {
    it(`only accepts valid arguments`, function () {
      for (const type of [null, undefined]) {
        const fr = () => adapterFactory(type);
        expect(fr).to.throw(TypeError, `[adapter-undefined]`);
      }
      for (const type of ['string', [], 123, {}]) {
        const fr = () => adapterFactory(type);
        expect(fr).to.throw(TypeError, `[adapter-invalid]`);
      }
      for (const type of [{name: 'name', render: function () {}}]) {
        const fr = () => adapterFactory(type);
        expect(fr).to.not.throw();
      }
    });
  });
  describe('adapter plugin method', function () {
    it(`only accepts valid values for the 'files' argument`);
  });
});
