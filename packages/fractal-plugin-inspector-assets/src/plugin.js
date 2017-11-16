const util = require('util');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const {promisify} = require('@frctl/utils');
const {FileCollection, FileSystemStack} = require('@frctl/support');
const ComponentResolver = require('@frctl/webpack-fractal-components-resolver-plugin');
const debug = require('debug')('frctl:plugin:inspector-assets');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const styleTest = /\.(sass|scss|css)$/;
const fileTest = /\.(svg|png|jpg|jpeg|gif|webm|mp4|ogg|woff|woff2)$/;

const getConfig = (component, components, app) => {
  const basePath = component.getSrc().path;
  const stem = component.id;
  const extractSASS = new ExtractTextPlugin(`${basePath}/${stem}.css`);
  const entryMatcher = app.get('components.config.defaults.preview.assets', '**/preview.js');
  const componentResolver = new ComponentResolver({components});
  return {
    context: process.cwd(),
    entry: component.getAssets().filter(entryMatcher).toArray().map(file => file.path),
    output: {
      filename: `${stem}.js`,
      path: `${path.join(basePath)}`,
      library: 'FractalExport',
      libraryTarget: 'umd'
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

    async handler(components, state, app) {
      const entryMatcher = app.get('components.config.defaults.preview.entry', '**/preview.js');
      // FIXME: looping/compiling need to be optimised here
      return await components.mapAsync(async component => {
        const outputFileSystem = new MemoryFS();
        component.inspector = component.inspector || {};
        const assets = component.getAssets();
        const entries = assets.filter(entryMatcher);
        if (assets.length === 0 || entries.length === 0) {
          component.inspector.assets = new FileCollection();
          return component;
        }
        assets.toMemoryFS(memoryFs);

        const config = getConfig(component, components, app);
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
        debug(`Webpack compiler plugin result for ${component.id}: ${res}`);

        component.inspector.assets = await FileCollection.fromMemoryFS(outputFileSystem); // TODO: should this overwrite, or merge in some way?
        debug(`
component: ${util.inspect(component.inspector.assets.mapToArray(file => ({path: file.path, contents: file.contents.toString()})), {showHidden: false, depth: 4})}
`);
        return component;
      });
    }
  };
};
