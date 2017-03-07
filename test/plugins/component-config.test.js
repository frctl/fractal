/* eslint-disable no-unused-expressions */
const fileHelper = require('./support/files')('components');

const configPluginFactory = fileHelper.getPlugin('config');

const testUtils = require('./support/utils')('components');

const testSignature = testUtils.testSignature;
const testPlugin = testUtils.testPlugin;
const testFactory = testUtils.testFactory;

describe(`'Component config' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(configPluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function (done) {
      testSignature('config', done);
    });

    it(`adds expected 'component.config' values`, function (done) {
      const configPlugin = configPluginFactory();
      const mocks = [{
        files: [{
          path: '/comp/a',
          role: 'config',
          parsed: {
            labelA: 'A'
          }
        }, {
          path: '/comp/b',
          role: 'config',
          parsed: {
            labelB: 'B'
          }
        }, {
          path: '/comp/c',
          role: 'config',
          parsed: {
            labelC: 'C'
          }
        }]
      }];
      const expected = [{
        config: {
          labelA: 'A',
          labelB: 'B',
          labelC: 'C'
        },
        files: [{
          path: '/comp/a',
          role: 'config',
          parsed: {
            labelA: 'A'
          }
        }, {
          path: '/comp/b',
          role: 'config',
          parsed: {
            labelB: 'B'
          }
        }, {
          path: '/comp/c',
          role: 'config',
          parsed: {
            labelC: 'C'
          }
        }]
      }];
      testPlugin(configPlugin, mocks, expected, done);
    });

    it(`adds expected 'component.config' path order-dependent values`, function (done) {
      const configPlugin = configPluginFactory();
      const mocks = [{
        files: [{
          path: '/comp/a',
          role: 'config',
          parsed: {
            label: 'A'
          }
        }, {
          path: '/comp/b',
          role: 'config',
          parsed: {
            label: 'B'
          }
        }, {
          path: '/comp/c',
          role: 'config',
          parsed: {
            label: 'C'
          }
        }]
      }];
      const expected = [{
        config: {
          label: 'C'
        },
        files: [{
          path: '/comp/a',
          role: 'config',
          parsed: {
            label: 'A'
          }
        }, {
          path: '/comp/b',
          role: 'config',
          parsed: {
            label: 'B'
          }
        }, {
          path: '/comp/c',
          role: 'config',
          parsed: {
            label: 'C'
          }
        }]
      }];
      testPlugin(configPlugin, mocks, expected, done);
    });

    it(`shallow merges expected 'component.config' values`, function (done) {
      const configPlugin = configPluginFactory();
      const mocks = [{
        files: [{
          path: '/comp/a',
          role: 'config',
          parsed: {
            label: {
              one: 'A'
            }
          }
        }, {
          path: '/comp/b',
          role: 'config',
          parsed: {
            label: {
              two: 'B'
            }
          }
        }, {
          path: '/comp/c',
          role: 'config',
          parsed: {
            label: {
              three: 'C'
            }
          }
        }]
      }];
      const expected = [{
        config: {
          label: {
            three: 'C'
          }
        },
        files: [{
          path: '/comp/a',
          role: 'config',
          parsed: {
            label: {
              one: 'A'
            }
          }
        }, {
          path: '/comp/b',
          role: 'config',
          parsed: {
            label: {
              two: 'B'
            }
          }
        }, {
          path: '/comp/c',
          role: 'config',
          parsed: {
            label: {
              three: 'C'
            }
          }
        }]
      }];
      testPlugin(configPlugin, mocks, expected, done);
    });
  });
});
