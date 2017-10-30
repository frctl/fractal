const {expect} = require('../../../../test/helpers');
const tests = require('../../../../test/runners/plugins')(__dirname);
const {ComponentCollection, FileCollection, File} = require('../../../internals/support');

const makeComponent = name => ({
  src: new File({
    path: `${__dirname}/../components/${name}`,
    stat: {
      isDirectory: () => true
    }
  }),
  files: new FileCollection([
    new File({
      path: `${__dirname}/../components/${name}/${name}.js`,
      contents: new Buffer(`
var padStart = require('lodash/padStart');
var t = padStart('${name}', 8);`)
    }),
    new File({
      path: `${__dirname}/../components/${name}/${name}.view.hbs`,
      contents: new Buffer(`<button class=${name}>${name}</button>`, 'utf-8')
    }),
    new File({
      path: `${__dirname}/../components/${name}/${name}.scss`,
      contents: new Buffer(`
$red: #f00;
.${name} {
  color: $red;
}`, 'utf-8')
    }),
    new File({
      path: `${__dirname}/../components/${name}/${name}.css`,
      contents: new Buffer(`
.blue {
  color: blue;
}`, 'utf-8')
    }),
    new File({
      path: `${__dirname}/../components/${name}/${name}-bg.png`,
      contents: new Buffer([8, 6, 7, 5, 3, 0, 9])
    })
  ]),
  config: {
    id: `${name}-id-set`,
    assets: {
      scripts: '**/*.js',
      styles: '**/*.{scss,css}',
      images: '**/*.{png,jpg}'
    }
  }
});

const makeEmptyComponent = name => ({
  src: new File({
    path: `${__dirname}/../components/${name}`,
    stat: {
      isDirectory: () => true
    }
  }),
  files: new FileCollection(),
  config: {
    id: `${name}-id-set`,
    assets: {
      scripts: '**/*.js',
      styles: '**/*.{scss,css}',
      images: '**/*.{png,jpg}'
    }
  }
});

const makeSingleAssetComponent = (name, type) => {
  let files = {
    js: new File({
      path: `${__dirname}/../components/${name}/${name}.js`,
      contents: new Buffer(`
var padStart = require('lodash/padStart');
var t = padStart('${name}', 8);`)
    }),
    scss: new File({
      path: `${__dirname}/../components/${name}/${name}.scss`,
      contents: new Buffer(`
$red: #f00;
.${name} {
color: $red;
}`, 'utf-8')
    }),
    css: new File({
      path: `${__dirname}/../components/${name}/${name}.css`,
      contents: new Buffer(`
.blue {
  color: blue;
}`, 'utf-8')
    })
  };

  const chosenFile = files[type] || files.js;

  return {
    src: new File({
      path: `${__dirname}/../components/${name}`,
      stat: {
        isDirectory: () => true
      }
    }),
    files: new FileCollection([chosenFile]),
    config: {
      id: `${name}-id-set`,
      assets: {
        scripts: '**/*.js',
        styles: '**/*.{scss,css}',
        images: '**/*.{png,jpg}'
      }
    }
  };
};
const makeCollection = () => ComponentCollection.from([makeComponent('one'), makeComponent('two')]);
const makeAssetlessCollection = () => ComponentCollection.from([makeEmptyComponent('three'), makeEmptyComponent('four')]);
const makeSingleAssetCollection = (name, type) => ComponentCollection.from([makeSingleAssetComponent(name, type)]);

tests.addPluginTest({
  description: 'sets an inspector.asset property on each component',
  input: makeCollection(),
  timeout: 3000,
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
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(2);
    }
  }
});

tests.addPluginTest({
  description: 'works if component has single css asset',
  input: makeSingleAssetCollection('seven', 'css'),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(2);
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
