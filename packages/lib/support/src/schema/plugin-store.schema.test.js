const {expect, validateSchema} = require('../../../../../test/helpers');
const pluginStoreSchema = require('./plugin-store.schema');

describe('PluginStore schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(pluginStoreSchema)).to.equal(true);
  });
});
