/* eslint-disable no-unused-expressions */
const fileHelper = require('./support/files')('components');

const namePluginFactory = fileHelper.getPlugin('name');

const testUtils = require('./support/utils')('components');

const testSignature = testUtils.testSignature;
const testPlugin = testUtils.testPlugin;
const testFactory = testUtils.testFactory;

describe(`'Component name' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(namePluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function (done) {
      testSignature('name', done);
    });

    it(`adds expected 'component.name' values if 'name' but not 'config.name' is set`, function (done) {
      const namePlugin = namePluginFactory();
      const mocks = [{
        name: 'component-one'
      },
      {
        name: 'component-Two.view'
      },
      {
        name: 'component-three.view.longer'
      }
      ];
      const expected = [{
        name: 'component-one'
      },
      {
        name: 'component-two-view'
      },
      {
        name: 'component-three-view-longer'
      }
      ];
      testPlugin(namePlugin, mocks, expected, done);
    });

    it(`adds expected 'component.name' values if 'config.name' is set`, function (done) {
      const namePlugin = namePluginFactory();
      const mocks = [{
        name: 'component-one',
        config: {
          name: 'config.component-one'
        }
      },
      {
        name: 'component-Two.view',
        config: {
          name: 'config.component-Two.view'
        }
      },
      {
        name: 'component-three.view.longer',
        config: {
          name: 'config.component-three.view.longer'
        }
      }
      ];
      const expected = [{
        name: 'config-component-one',
        config: {
          name: 'config.component-one'
        }
      },
      {
        name: 'config-component-two-view',
        config: {
          name: 'config.component-Two.view'
        }
      },
      {
        name: 'config-component-three-view-longer',
        config: {
          name: 'config.component-three.view.longer'
        }
      }
      ];
      testPlugin(namePlugin, mocks, expected, done);
    });
  });
});
