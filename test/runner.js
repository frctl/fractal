/* eslint import/no-dynamic-require: off */
const {join} = require('path');
const {FileCollection, ComponentCollection} = require('../packages/lib/support');
const appFactory = require('../packages/fractal');
const {expect} = require('./helpers');

module.exports = function (testPath) {
  const pkgPath = join(testPath, '..');
  const pkgName = require(join(pkgPath, 'package.json')).name;
  const target = require(pkgPath);
  const moduleTests = [];

  let testCallback = () => {};

  function createMockState(state = {}) {
    return {
      files: FileCollection.from(state.files || []),
      components: ComponentCollection.from(state.components || [])
    };
  }

  function createApp(config) {
    return appFactory(config || {});
  }

  function run(toplevelPredicate = describe) {
    toplevelPredicate(pkgName, function () {
      describe('the module', function () {
        it('is exported as a function', function () {
          expect(target).to.be.a('function');
        });

        for (const {description, test} of moduleTests) {
          it(description, function (done) {
            test(target);
            done();
          });
        }
      });

      testCallback();
    });
  }

  function runOnly() {
    run(describe.only);
  }

  function onRun(fn) {
    testCallback = fn;
  }

  return {
    createMockState,
    createApp,
    run,
    runOnly,
    onRun,
    target
  };
};
