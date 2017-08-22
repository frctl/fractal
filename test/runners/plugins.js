/* eslint no-unused-expressions: off */
const {expect, validate} = require('../helpers');
const {Collection} = require('../../packages/internals/support');
const {pluginSchema} = require('../../packages/internals/support/schema');
const runnerFactory = require('../runner');

module.exports = function (testPath) {
  const pluginTests = [];
  const runner = runnerFactory(testPath);
  const pluginFactory = runner.target;

  runner.addPluginTest = obj => {
    pluginTests.push(obj);
  };

  runner.onRun(() => {
    describe('the factory function', function () {
      it('creates a valid plugin object', function () {
        const plugin = pluginFactory();
        expect(plugin).to.be.an('object');
        expect(validate(plugin, pluginSchema)).to.be.true;
      });
    });

    describe('.handler()', function () {
      it('returns an array, collection (or a promise that resolves to an array or collection)', function () {
        const handler = pluginFactory().handler;
        const result = Promise.resolve(handler([], runner.createMockState(), runner.createApp()));
        result.then(result => {
          expect(Array.isArray(result) || Collection.isCollection(result)).to.equal(true);
        });
        return result;
      });

      for (let {description, test, throws, opts = {}, input = [], state, app} of pluginTests) {
        const plugin = pluginFactory(opts);
        input = Collection.from(input);

        it(description, function () {
          try {
            const result = plugin.handler(input, state, app);
            return Promise.resolve(result)
              .then(result => test(result))
              .catch(err => {
                if (throws) {
                  return test(err);
                }
                throw err;
              });
          } catch (err) {
            if (throws) {
              return Promise.resolve(true).then(() => test(err));
            }
            throw err;
          }
        });
      }
    });
  });

  return runner;
};
