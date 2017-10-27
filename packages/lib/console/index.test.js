const {expect} = require('../../../test/helpers');
const log = require('./src/log');
const main = require('.');

describe('main exports', function () {
  it('exports all log methods', function () {
    Object.keys(log).forEach(key => {
      expect(main[key]).to.equal(log[key]);
    });
  });
});
