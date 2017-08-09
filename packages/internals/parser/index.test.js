const {expect} = require('../../../test/helpers');
const main = require('.');

const srcExports = {
  Parser: require('./src/parser'),
  Transformer: require('./src/transform/transformer')
};

describe('Parser exports', function () {
  it('exports all Parser classes and the main factory', function () {
    expect(main).to.be.a('function');
    Object.keys(srcExports).forEach(key => {
      expect(main[key]).to.equal(srcExports[key]);
    });
  });
});
