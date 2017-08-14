/* eslint handle-callback-err: off, no-unused-expressions: off */

const {expect, validateSchema} = require('../../../../../test/helpers');
const makePlugin = require('../../test/helpers').makePlugin;
const Plugin = require('./plugin');
const pluginSchema = require('./plugin.schema');

const validPluginProps = makePlugin();

describe('Plugin', function () {
  describe('constructor', function () {
    it('returns a new instance if correct properties provided', function () {
      const plugin = new Plugin(validPluginProps);
      expect(plugin instanceof Plugin).to.be.true;
      expect(plugin).to.be.a('Plugin');
    });
    it('throws an error if missing or incorrect properties provided', function () {
      expect(() => new Plugin()).to.throw(TypeError, '[invalid-properties]');
      expect(() => new Plugin(['name', 'val'])).to.throw(TypeError, '[invalid-properties]');
      expect(() => new Plugin({name: 'name'})).to.throw(TypeError, '[invalid-properties]');
    });
  });

  describe('Plugin schema', function () {
    it('is a valid schema', function () {
      expect(validateSchema(pluginSchema)).to.equal(true);
    });
  });
});
