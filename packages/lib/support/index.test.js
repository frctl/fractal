const {expect} = require('../../../test/helpers');
const main = require('./index');

const srcExports = {
  Collection: require('./src/collections/collection'),
  ComponentCollection: require('./src/collections/component-collection'),
  FileCollection: require('./src/collections/file-collection'),
  EntityCollection: require('./src/collections/entity-collection'),
  Entity: require('./src/entities/entity'),
  File: require('./src/entities/file'),
  Component: require('./src/entities/component'),
  Variant: require('./src/entities/variant'),
  Template: require('./src/entities/template'),
  Scenario: require('./src/entities/scenario'),
  Emitter: require('./src/emitter'),
  EmittingPromise: require('./src/emitting-promise'),
  Validator: require('./src/validator'),
  FileSystemReader: require('./src/fs/fs-file-reader'),
  FileSystemStack: require('./src/fs/fs-stack')
};

describe('Support exports', function () {
  it('exports all support classes', function () {
    Object.keys(main).forEach(key => {
      expect(main[key]).to.equal(srcExports[key]);
    });
  });
});
