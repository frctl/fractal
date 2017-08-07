const {expect} = require('../../../test/helpers');
const main = require('./index');

const srcExports = {
  Collection: require('./src/collection'),
  ComponentCollection: require('./src/component-collection'),
  Entity: require('./src/entity'),
  File: require('./src/file'),
  FileCollection: require('./src/file-collection'),
  Component: require('./src/component'),
  Variant: require('./src/variant')
};

const pendingSrcExports = {
  Emitter: undefined
};

describe('Support exports', function () {
  it('exports all support classes', function () {
    Object.keys(srcExports).forEach(key => {
      expect(main[key]).to.equal(srcExports[key]);
    });
  });

  it('does not yet export pending support classes', function () {
    Object.keys(pendingSrcExports).forEach(key => {
      expect(main[key]).to.equal(undefined);
    });
  });
});
