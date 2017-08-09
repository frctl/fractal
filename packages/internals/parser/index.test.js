const {expect} = require('../../../test/helpers');
const Parser = require('./src/parser');
const main = require('.');

const srcExports = {
  Parser: require('./src/parser'),
  Transformer: require('./src/transform/transformer')
};

describe('Parser main', function () {
  it('exports all Parser classes', function () {
    Object.keys(srcExports).forEach(key => {
      expect(main[key]).to.equal(srcExports[key]);
    });
  });
  it('exports a factory that creates a new Parser', function () {
    expect(main).to.be.a('function');
    expect(main()).to.be.an.instanceof(Parser);
  });
});
