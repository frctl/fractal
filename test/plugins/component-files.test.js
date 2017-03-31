/* eslint-disable no-unused-expressions */

const expect = require('@frctl/utils/test').expect;
const fileHelper = require('./support/files')('components');

const namePluginFactory = fileHelper.getPlugin('files');

const {testSignature, testPlugin, testFactory} = require('./support/utils')('components');

describe(`'Component files' plugin`, function () {
  describe('constructor', function () {
    it(`factory returns a function`, function () {
      testFactory(namePluginFactory);
    });
  });

  describe('instance method', function () {
    it(`has expected signature`, function (done) {
      testSignature('files', done);
    });

    it(`adds a component 'scope' property to all files in the 'component.files' array`, function (done) {
      const filesPlugin = namePluginFactory();
      const mocks = [{
        name: 'component-one',
        files: [{
          name: 'view.njk'
        }]
      }];
      const expected = [{
        name: 'component-one',
        files: [{
          name: 'view.njk',
          scope: 'component'
        }]
      }];
      testPlugin(filesPlugin, mocks, expected, done);
    });

    it(`adds a 'componentPath' property to all files in the 'component.files' array`, function (done) {
      const filesPlugin = namePluginFactory();
      const mocks = [{
        name: 'component-one',
        path: 'path/to/@component',
        files: [{
          name: 'view.njk',
          path: 'path/to/@component/view.njk'
        }, {
          name: 'asset.css',
          path: 'path/to/@component/assets/asset.css'
        }]
      }];
      const expected = [
        [{
          componentPath: 'view.njk'
        }, {
          componentPath: 'assets/asset.css'
        }]
      ];
      filesPlugin(mocks, function () {
        for (var i = 0; i < mocks.length; i++) {
          for (var j = 0; j < mocks[i].files.length; j++) {
            expect(mocks[i].files[j].componentPath).to.equal(expected[i][j].componentPath);
          }
        }
        done();
      });
    });
  });
});
