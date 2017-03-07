/* eslint-disable no-unused-expressions */
const fileHelper = require('./support/files')('components');

const labelPluginFactory = fileHelper.getPlugin('label');

const testUtils = require('./support/utils')('components');

const testSignature = testUtils.testSignature;
const testPlugin = testUtils.testPlugin;
const testFactory = testUtils.testFactory;

describe(`'Component label' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(labelPluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function (done) {
      testSignature('name', done);
    });

    it(`adds expected 'component.label' values if 'config.label is not set'`, function (done) {
      const labelPlugin = labelPluginFactory();
      const fileMocks = [{
        name: 'component-one'
      },
      {
        name: 'component-Two.view'
      },
      {
        name: 'component-three.view.longer'
      }
      ];
      const fileExpected = [{
        name: 'component-one',
        label: 'Component One'
      },
      {
        name: 'component-Two.view',
        label: 'Component Two View'
      },
      {
        name: 'component-three.view.longer',
        label: 'Component Three View Longer'
      }
      ];
      testPlugin(labelPlugin, fileMocks, fileExpected, done);
    });

    it(`adds expected 'component.label' values if 'config.label' is set`, function (done) {
      const labelPlugin = labelPluginFactory();
      const fileMocks = [{
        name: 'component-one',
        config: {
          label: 'config.component-one'
        }
      },
      {
        name: 'component-Two.view',
        config: {
          label: 'config.component-Two.view'
        }
      },
      {
        name: 'component-three.view.longer',
        config: {
          label: 'config.component-three.view.longer'
        }
      }
      ];
      const fileExpected = [{
        name: 'component-one',
        label: 'config.component-one',
        config: {
          label: 'config.component-one'
        }
      },
      {
        name: 'component-Two.view',
        label: 'config.component-Two.view',
        config: {
          label: 'config.component-Two.view'
        }
      },
      {
        name: 'component-three.view.longer',
        label: 'config.component-three.view.longer',
        config: {
          label: 'config.component-three.view.longer'
        }
      }
      ];
      testPlugin(labelPlugin, fileMocks, fileExpected, done);
    });
  });
});
