const util = require('util');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const {promisify} = require('@frctl/utils');
const {FileCollection, FileSystemStack, ComponentCollection} = require('@frctl/support');
const debug = require('debug')('frctl:plugin:inspector-assets');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const styleTest = /\.(sass|scss|css)$/;
const fileTest = /\.(svg|png|jpg|jpeg|gif|webm|mp4|ogg|woff|woff2)$/;

const getPathHead = (modulePath) => {
  return modulePath.split(path.sep)[0]
}
const getPathTail = (modulePath) => {
  return modulePath.split(path.sep).slice(1).join(path.sep);
}

const ComponentResolver = function(options) {
  this.components = options.components;
};

ComponentResolver.prototype.apply = function(resolver) {
  const components = this.components;

  resolver.plugin('module', function(shortRequest, callback) {

    const shortPath = shortRequest.request;
    // console.log(shortRequest);

    // ignore relative or absolute paths
    if ( /^\W+/.test(shortPath)){
      return callback();
    } else {
      console.log('ADDING PATH', shortPath);
    }

    const componentId = getPathHead(shortPath);
    const requestTail = getPathTail(shortPath);

    const component = components.find('id', componentId);

    //ignore paths which don't match a component
    if (!component) {
      return callback();
    }

    console.log(shortPath, componentId, requestTail);
    //resolve the long path
    var longPath = component.path;

    // console.log(path.join(longPath, requestTail))

    //create a new request to resolve the full path
    const longRequest = {
      path: path.join(longPath, requestTail),
      query: shortRequest.query,
      file: true, resolved: true
    };

    // console.log('longreq', longRequest);

    //resolve the long path
    return resolver.doResolve(['file'], longRequest, 'expanded component path \'' + shortPath + '\' to \'' + path.join(longPath, requestTail) + '\'', callback);
  });
}

const getConfig = (component, components) => {
  const basePath = component.getSrc().path;
  const stem = component.getSrc().stem;
  const extractSASS = new ExtractTextPlugin(`${basePath}/${stem}.css`);
  const componentResolver = new ComponentResolver({components});
  return {
    context: process.cwd(),
    entry: component.getAssets().toArray().map(file => file.path),
    output: {
      filename: `${stem}.js`,
      path: `${path.join(basePath)}`
    },
    resolve: {
      plugins: [
        componentResolver
      ],
      modules: [path.join(process.cwd(), 'node_modules')]
    },
    module: {
      rules: [
        { // sass / scss loader for webpack
          test: styleTest,
          use: extractSASS.extract(['css-loader', 'sass-loader'])
        },
        {
          test: fileTest,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }]
        }
      ]
    },
    plugins: [
      extractSASS
    ]
  };
};

const memoryFs = new MemoryFS();
const inputFileSystem = new FileSystemStack([memoryFs, fs]);

module.exports = function (opts = {}) {
  return {

    name: 'inspector-assets',

    transform: 'components',

    async handler(_components, state, app) {
      // FIXME: looping/compiling need to be optimised here
      const components = await _components.mapAsync(async component => {
        const outputFileSystem = new MemoryFS();
        component.inspector = component.inspector || {};
        const assets = component.getAssets();
        if (assets.length === 0) {
          component.inspector.assets = new FileCollection();
          return component;
        }
        assets.toMemoryFS(memoryFs);

        const config = getConfig(component, _components);
        const compiler = webpack(config);
        const pRun = promisify(compiler.run.bind(compiler));

        compiler.inputFileSystem = inputFileSystem;
        compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.loader.fileSystem = compiler.inputFileSystem;
        compiler.outputFileSystem = outputFileSystem;

        const res = await pRun().catch(err => {
          debug(`Error running plugin handler: ${err}`);
        });
        console.log(res);

        component.inspector.assets = await FileCollection.fromMemoryFS(outputFileSystem); // TODO: should this overwrite, or merge in some way?
        debug(`
component: ${util.inspect(component.inspector.assets.mapToArray(file => ({path: file.path, contents: file.contents.toString()})), {showHidden: false, depth: 4})}
`);
        return component;
      });

      return components;
    }

  };
};
