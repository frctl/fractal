/* eslint no-unused-expressions : "off", handle-callback-err: "off" */
const fileHelper = require('./support/files')('files');

const adapterPluginFactory = fileHelper.getPlugin('adapter');

const {testInvalidArgs, testValidArgs, testSignature, testPlugin, testFactory} = require('./support/utils')('files');

describe(`'File adapter' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(adapterPluginFactory);
    });

    it(`only accepts valid arguments`, function () {
      testInvalidArgs(adapterPluginFactory, [null, undefined], `[adapter-undefined]`);
      testInvalidArgs(adapterPluginFactory, ['string', [], 123, {}], `[adapter-invalid]`);
      testInvalidArgs(adapterPluginFactory, [{name: 'name', match: 234}, {name: 'name', match: {}}], `[adapter-invalid]`);
      testValidArgs(adapterPluginFactory, [{name: 'name', match: function () {}}, {name: 'name', match: 'string'}]);
    });
  });
  describe('instance method', function () {
    it(`has expected signature`, function (done) {
      testSignature('adapter', done, {
        name: 'adapter',
        match: () => {}
      });
    });

    it(`adds expected 'file.adapter' values with 'string' match value`, function (done) {
      const adapterPlugin = adapterPluginFactory({name: 'react', match: '.jsx'});

      const fileMocks = [{
        ext: '.jsx',
        role: 'view'
      },
      {
        ext: '.jsx',
        role: 'config'
      },
      {
        ext: '.js',
        role: 'view'
      }
      ];
      const fileExpected = [{
        ext: '.jsx',
        role: 'view',
        adapter: 'react'
      },
      {
        ext: '.jsx',
        role: 'config'
      },
      {
        ext: '.js',
        role: 'view'
      }
      ];
      testPlugin(adapterPlugin, fileMocks, fileExpected, done);
    });

    it(`adds expected 'file.adapter' values with 'function' match value`, function (done) {
      const adapterPlugin = adapterPluginFactory({name: 'nunjucks', match: file => file.ext === '.njk'});

      const fileMocks = [{
        ext: '.njk',
        role: 'view'
      },
      {
        ext: '.njk',
        role: 'config'
      },
      {
        ext: '.nj',
        role: 'view'
      }
      ];
      const fileExpected = [{
        ext: '.njk',
        role: 'view',
        adapter: 'nunjucks'
      },
      {
        ext: '.njk',
        role: 'config'
      },
      {
        ext: '.nj',
        role: 'view'
      }
      ];
      testPlugin(adapterPlugin, fileMocks, fileExpected, done);
    });
  });
});
