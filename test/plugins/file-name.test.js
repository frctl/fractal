/* eslint-disable no-unused-expressions */
const fileHelper = require('./support/files')('files');

const namePluginFactory = fileHelper.getPlugin('name');

const {testSignature, testPlugin, testFactory} = require('./support/utils')('files');

describe(`'File name' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(namePluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function (done) {
      testSignature('name', done);
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
