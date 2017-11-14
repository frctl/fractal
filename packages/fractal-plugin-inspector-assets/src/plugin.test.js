const {expect} = require('../../../test/helpers');
const tests = require('../../../test/runners/plugins')(__dirname);
const {ComponentCollection, Component, FileCollection, File} = require('../../lib/support');

const makeComponent = name => Component.from({
  src: new File({
    path: `${__dirname}/../components/${name}`,
    stat: {
      isDirectory: () => true
    }
  }),
  files: FileCollection.from([
    new File({
      path: `${__dirname}/../components/${name}/${name}.js`,
      contents: new Buffer(`
var padStart = require('lodash/padStart');
var t = padStart('${name}', 8);`)
    }),
    new File({
      path: `${__dirname}/../components/${name}/${name}.view.hbs`,
      contents: new Buffer(`<button class="${name}">${name}</button>`, 'utf-8')
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

const makeEmptyComponent = name => Component.from({
  src: new File({
    path: `${__dirname}/../components/${name}`,
    stat: {
      isDirectory: () => true
    }
  }),
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

  return Component.from({
    src: new File({
      path: `${__dirname}/../components/${name}`,
      stat: {
        isDirectory: () => true
      }
    }),
    files: FileCollection.from([chosenFile]),
    config: {
      id: `${name}-id-set`,
      assets: {
        scripts: '**/*.js',
        styles: '**/*.{scss,css}',
        images: '**/*.{png,jpg}'
      }
    }
  });
};
const makeCollection = () => ComponentCollection.from([makeComponent('one'), makeComponent('two')]);
const makeAssetlessCollection = () => ComponentCollection.from([makeEmptyComponent('three'), makeEmptyComponent('four')]);
const makeSingleAssetCollection = (name, type) => ComponentCollection.from([makeSingleAssetComponent(name, type)]);
const makeDependentComponents = () => ComponentCollection.from([
  Component.from({
    src: new File({
      path: `${__dirname}/../components/button`,
      stat: {
        isDirectory: () => true
      }
    }),
    files: FileCollection.from([
      new File({
        path: `${__dirname}/../components/button/button.js`,
        contents: new Buffer(`
  console.log('button');`)
      }),
      new File({
        path: `${__dirname}/../components/button/button.view.hbs`,
        contents: new Buffer(`<button class="button">button</button>`, 'utf-8')
      }),
      new File({
        path: `${__dirname}/../components/button/button.scss`,
        contents: new Buffer(`
  $red: #f00;
  .button {
    color: $red;
  }`, 'utf-8')
}),
      new File({
        path: `${__dirname}/../components/button/preview.js`,
        contents: new Buffer(`
require('./button.scss');
module.exports = function(scenario) {
  require('./button.js');
}`)
      })
    ]),
    config: {
      id: `button`,
      assets: {
        scripts: '**/*.js',
        styles: '**/*.{scss,css}',
        images: '**/*.{png,jpg}'
      }
    }
  }),
  Component.from({
    src: new File({
      path: `${__dirname}/../components/card`,
      stat: {
        isDirectory: () => true
      }
    }),
    files: FileCollection.from([
      new File({
        path: `${__dirname}/../components/card/card.js`,
        contents: new Buffer(`
module.exports = function(){
  require('button/button.js');
  console.log('card')
}`)
      }),
      new File({
        path: `${__dirname}/../components/card/card.view.hbs`,
        contents: new Buffer(`
          <div class="card">
            <h3 class="card__title">{{ title }}</h3>
            <p class="card__content">{{ text }}</p>
          </div>`, 'utf-8')
      }),
      new File({
        path: `${__dirname}/../components/card/card.scss`,
        contents: new Buffer(`
@import '~button/button.scss';
$border-color: #ccc;
.card {
  border: 1px solid $border-color;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
  max-width: 500px;
  border-radius: 4px;
  padding: 1em;
  font-family: sans-serif;
}
.card__title {
  margin: 0.4em 0 0.5em 0;
}
.card__content {
  line-height: 1.4;
}`, 'utf-8')
      }),
    new File({
      path: `${__dirname}/../components/card/preview.js`,
      contents: new Buffer(`
require('./card.scss');
const card = require('./card.js');

module.exports = function(scenario){
  card({
    text: scenario.context.text
  });
}`)})
]),
    config: {
      id: `card`,
      assets: {
        scripts: '**/*.js',
        styles: '**/*.{scss,css}',
        images: '**/*.{png,jpg}'
      }
    }
  })
])

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
      expect(component.inspector.assets.length).to.equal(2); // webpack always creates js file, in this case empty
    }
  }
});

tests.addPluginTest({
  description: 'works if component has single css asset',
  input: makeSingleAssetCollection('seven', 'css'),
  test: function (collection) {
    for (const component of collection) {
      expect(component.inspector.assets).to.be.a('FileCollection');
      expect(component.inspector.assets.length).to.equal(2); // webpack always creates js file, in this case empty
    }
  }
});

tests.addPluginTest({
  description: 'sets an inspector.asset property on each component when the components have dependencies on each other',
  input: makeDependentComponents(),
  timeout: 3000,
  test: function (collection) {
    for (const component of collection) {
      component.inspector.assets.toArray().map(file => console.log('\n', file.path, file.contents.toString()));
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

tests.runOnly();
