const {expect} = require('../../../test/helpers');
const log = require('./src/log');
const utils = require('./src/utils');
const main = require('./index');

describe('main exports', function () {
  it('exports all log methods', function () {
    Object.keys(log).forEach(key => {
      expect(main[key]).to.equal(log[key]);
    });
  });

  it('exports utility methods under the .utils property', function () {
    Object.keys(utils).forEach(key => {
      expect(main.utils[key]).to.equal(utils[key]);
    });
  });
});
