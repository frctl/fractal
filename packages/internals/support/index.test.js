const {expect} = require('../../../test/helpers');
const main = require('./index');

const srcExports = {
  Collection: require('./src/collection'),
  ComponentCollection: require('./src/component-collection'),
  Entity: require('./src/entity'),
  File: require('./src/file'),
  FileCollection: require('./src/file-collection'),
  Component: require('./src/component'),
  Variant: require('./src/variant'),
  Emitter: require('./src/emitter'),
  EmittingPromise: require('./src/emitting-promise'),
  Validator: require('./src/validator')
};

describe('Support exports', function () {
  it('exports all support classes', function () {
    Object.keys(main).forEach(key => {
      expect(main[key]).to.equal(srcExports[key]);
    });
  });
});
