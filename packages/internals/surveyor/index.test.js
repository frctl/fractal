const {expect} = require('../../../test/helpers');
const main = require('.');

const srcExports = {
  Surveyor: require('./src/surveyor'),
  Transformer: require('./src/transform/transformer')
};

describe.only('Surveyor exports', function () {
  it('exports all Surveyor classes and the main factory', function () {
    expect(main).to.be.a('function');
    Object.keys(srcExports).forEach(key => {
      expect(main[key]).to.equal(srcExports[key]);
    });
  });
});
