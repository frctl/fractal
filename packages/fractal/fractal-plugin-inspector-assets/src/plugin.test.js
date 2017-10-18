const {expect} = require('../../../../test/helpers');
const tests = require('../../../../test/runners/plugins')(__dirname);
const {ComponentCollection,FileCollection,File} = require('../../../internals/support');
const plugin = require('./plugin')();

const makeComponent = name => ({
  src: new File({
    path: `/src/${name}`,
    stat: {
      isDirectory: () => true
    }
  }),
  files: new FileCollection([
    new File({
      path: `/src/${name}/${name}.js`,
      contents: new Buffer(`
        var _ = require('lodash');
var t = ${name};
console.log(t);`, 'utf-8')
    }),
    new File({
      path: `/src/${name}/${name}.view.hbs`,
      contents: new Buffer(`<button class=${name}>${name}</button>`, 'utf-8')
    }),
    new File({
      path: `/src/${name}/${name}.scss`,
      contents: new Buffer(`
$red: #f00;
.${name}: {
  color: $red;
}`, 'utf-8')
    }),
    new File({
      path: `/src/${name}/${name}-bg.png`,
      contents: new Buffer([8, 6, 7, 5, 3, 0, 9])
    })
  ]),
  config: {
    id: `${name}-id-set`,
    variants: [{
      id: `${name}-v1`
    }, {
      id: `${name}-v2`
    }],
    assets: {
      scripts: '**/*.js',
      styles: '**/*.scss',
      images: '**/*.{png,jpg}'
    }
  }
});

const makeCollection = () => ComponentCollection.from([makeComponent('one'), makeComponent('two')])

tests.addPluginTest({
  description: 'sets an inspector.asset property on each component',
  input: makeCollection(),
  test: function(collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection')
      console.log(component.inspector.assets.toArray().map(file=>file.contents.toString()));
    }
  }
});

tests.runOnly();
