/* eslint-disable no-unused-expressions */
const namePluginFactory = require('./support/files').plugins.name;

const testUtils = require('./support/utils');

const testSignature = testUtils.testSignature;
const testPlugin = testUtils.testPlugin;
const testFactory = testUtils.testFactory;

describe(`'File name' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(namePluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function () {
      testSignature('name');
    });

    it(`adds expected 'file.name' values`, function (done) {
      const namePlugin = namePluginFactory();
      const fileMocks = [{
        stem: 'file-one'
      },
      {
        stem: '_file-two'
      },
      {
        stem: '_01-file-three.view'
      },
      {
        stem: '01-file-three.view.longer'
      }
      ];
      const fileExpected = [{
        stem: 'file-one',
        name: 'file-one'
      },
      {
        stem: '_file-two',
        name: 'file-two'
      },
      {
        stem: '_01-file-three.view',
        name: 'file-three.view'
      },
      {
        stem: '01-file-three.view.longer',
        name: 'file-three.view.longer'
      }
      ];
      testPlugin(namePlugin, fileMocks, fileExpected, done);
    });
  });
});
