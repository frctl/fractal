const {expect, validateSchema} = require('../../../../../test/helpers');
const fileCollectionSchema = require('./file-collection.schema');

describe('PluginCollection schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(fileCollectionSchema)).to.equal(true);
  });
});
