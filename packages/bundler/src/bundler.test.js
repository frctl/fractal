const mockFs = require('mock-fs');
const fractal = require('@frctl/fractal');
const {File, FileCollection} = require('@frctl/support');
const {expect, sinon} = require('../../../test/helpers');
const Bundler = require('./bundler');

const mockFsDefition = {
  'assets':{
    'images': {
      'an-image.jpg':new Buffer([8, 6, 7, 5, 3, 0, 9])
    },
    'scripts': {
      'lib':{
        'jquery.min.js': 'module.exports = function(){}; '
      }
    }
  },
  'components/path/to/fake/@a-component': {
    'some-file.txt': 'file content here',
    'styles.scss': '* { box-sizing: border-box; } .a:before { contents: ""}',
    'view.hbs': 'A VIEW',
    'preview.hbs': 'A PREVIEW',
    'empty-dir': { /** empty directory */ }
  },
  'components/path/to/fake/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
  'components/path/to/fake/@b-component': {
    'view.hbs': 'B VIEW',
    'preview.hbs': 'B PREVIEW',
    'config.json': `{name: 'config.json', bar: 'baz'}`,
    'config.js': `module.exports = {name: 'config.js', foo: 'bar'}`,
    'some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
    '@nested-component': {
      'config.js': `module.exports = {name: 'config.js', foo: 'bar'}`,
      'scripts.js': `module.exports = function(){ console.log('boo'); }`,
      'styles.scss': '* { box-sizing: border-box; }',
      'view.hbs': 'Nested VIEW',
      'preview.hbs': 'Nested PREVIEW',
    }
  }
};



describe.only('Bundler', function () {
  describe('constructor', function () {
    it('creates a new instance', function(){
      const app = fractal();
      const bundler = new Bundler(app);
      expect(bundler instanceof Bundler).to.equal(true);
    });

  });
  describe('.generate()', function() {
    before(function () {
      mockFs(mockFsDefition);
    });

    after(function () {
      mockFs.restore();
    });

    it('generates the requested assets', async function(){
      const app = fractal({
        src: [process.cwd() + '/**']
        ,components: {
          config: {
            defaults: {
              assets:{
                match: '*.scss'
              }
            }
          }
        }

      });
      const bundler = new Bundler(app, {assets: {match:'*.js'} });
      const assetFiles = await bundler.getAssets();
      expect(assetFiles).to.not.be.undefined;
      console.log(assetFiles);
    })

  })
});
