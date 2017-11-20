const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../test/helpers');
const tests = require('../../../test/runners/plugins')(__dirname);
const {ComponentCollection, Component, FileCollection, File} = require('../../lib/support');

const virtualRelative = join('fixtures', 'components');
const virtualRoot = join(__dirname, '..', virtualRelative);

const makeComponent = name => Component.from({
  src: new File({
    path: join(virtualRoot, name),
    stat: {
      isDirectory: () => true
    }
  }),
  files: FileCollection.from([
    new File({
      path: join(virtualRoot, name, `${name}.js`),
      contents: new Buffer(`
var padStart = require('lodash/padStart');
var t = padStart('${name}', 8);`)
    }),
    new File({
      path: join(virtualRoot, name, `${name}.view.hbs`),
      contents: new Buffer(`<button class="${name}">${name}</button>`, 'utf-8')
    }),
    new File({
      path: join(virtualRoot, name, `${name}.scss`),
      contents: new Buffer(`
$red: #f00;
.${name} {
  color: $red;
}`, 'utf-8')
    }),
    new File({
      path: join(virtualRoot, name, `${name}.css`),
      contents: new Buffer(`
.blue {
  color: blue;
}`, 'utf-8')
    }),
    new File({
      path: join(virtualRoot, name, `${name}-bg.png`),
      contents: new Buffer([8, 6, 7, 5, 3, 0, 9])
    }),
    new File({
      path: join(virtualRoot, name, `preview.js`),
      contents: new Buffer(`
require('./${name}.scss');
require('./${name}.css');
require('./${name}-bg.png');
module.exports = function (scenario) {
  require('./${name}.js');
};`)
    })
  ]),
  config: {
    assets: {
      scripts: '**/*.js',
      styles: '**/*.{scss,css}',
      images: '**/*.{png,jpg}'
    }
  }
});

const makeEmptyComponent = name => Component.from({
  src: new File({
    path: join(virtualRoot, name),
    stat: {
      isDirectory: () => true
    }
  }),
  config: {
    assets: {
      scripts: '**/*.js',
      styles: '**/*.{scss,css}',
      images: '**/*.{png,jpg}'
    }
  }
});

const makeSingleAssetComponent = (name, type = 'js') => {
  let files = {
    js: new File({
      path: join(virtualRoot, name, `${name}.js`),
      contents: new Buffer(`
var padStart = require('lodash/padStart');
var t = padStart('${name}', 8);`)
    }),
    scss: new File({
      path: join(virtualRoot, name, `${name}.scss`),
      contents: new Buffer(`
$red: #f00;
.${name} {
color: $red;
}`, 'utf-8')
    }),
    css: new File({
      path: join(virtualRoot, name, `${name}.css`),
      contents: new Buffer(`
.blue {
  color: blue;
}`, 'utf-8')
    })
  };
  let previewFile = new File({
    path: join(virtualRoot, name, `preview.js`),
    contents: new Buffer(`
require('./${name}.${type}');
`)
  });

  const chosenFile = files[type];

  return Component.from({
    src: new File({
      path: join(virtualRoot, name),
      stat: {
        isDirectory: () => true
      }
    }),
    files: FileCollection.from([chosenFile, previewFile]),
    config: {
      assets: {
        scripts: '**/*.js',
        styles: '**/*.{scss,css}',
        images: '**/*.{png,jpg}'
      }
    }
  });
};
const appFactory = path => new Fractal({
  src: path
});
const makeCollection = () => ComponentCollection.from([makeComponent('one'), makeComponent('two')]);
const makeAssetlessCollection = () => ComponentCollection.from([makeEmptyComponent('three'), makeEmptyComponent('four')]);
const makeSingleAssetCollection = (name, type) => ComponentCollection.from([makeSingleAssetComponent(name, type)]);

tests.addPluginTest({
  description: 'sets an inspector.asset property on each component',
  input: makeCollection(),
  timeout: 3000,
  app: appFactory(virtualRoot),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.toArray().map(file => file.path).length).to.equal(3);
    }
  }
});

tests.addPluginTest({
  description: 'sets an empty object as inspector.asset property if component has no assets',
  input: makeAssetlessCollection(),
  app: appFactory(virtualRoot),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(0);
    }
  }
});

tests.addPluginTest({
  description: 'works if component has single js asset',
  input: makeSingleAssetCollection('five', 'js'),
  app: appFactory(virtualRoot),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(1);
    }
  }
});

tests.addPluginTest({
  description: 'works if component has single scss asset',
  input: makeSingleAssetCollection('six', 'scss'),
  app: appFactory(virtualRoot),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(2); // webpack always creates js file, in this case empty
    }
  }
});

tests.addPluginTest({
  description: 'works if component has single css asset',
  input: makeSingleAssetCollection('seven', 'css'),
  app: appFactory(virtualRoot),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(2); // webpack always creates js file, in this case empty
    }
  }
});

const depApp = appFactory(virtualRoot);

tests.addPluginTest({
  description: 'sets an inspector.asset property on each component when the components have dependencies on each other',
  input: (async path => {
    return await depApp.getComponents();
  })(),
  app: depApp,
  timeout: 3000,
  test: function (collection) {
    for (const component of collection) {
      // component.inspector.assets.toArray().map(file => console.log('\n', file.path, file.contents.toString()));
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.toArray().map(file => file.path).length).to.equal(2);
    }
  }
});

// tests.addPluginTest({
//  description: 'it works as a dependency'
// })

// tests.addPluginTest({
//  description: 'it works for media and font assets'
// })

tests.run();
