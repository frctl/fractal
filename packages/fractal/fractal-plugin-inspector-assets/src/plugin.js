const util = require('util');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const {promisify} = require('@frctl/utils');
const {FileCollection, FileSystemStack} = require('@frctl/support');
const debug = require('debug')('frctl:plugin:inspector-assets');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const styleTest = /\.(sass|scss|css)$/;
const fileTest = /\.(svg|png|jpg|jpeg|gif|webm|mp4|ogg|woff|woff2)$/;

const getConfig = component => {
  const basePath = component.getSrc().path;
  const stem = component.getSrc().stem;
  const extractSASS = new ExtractTextPlugin(`${basePath}/${stem}.css`);

  return {
    context: process.cwd(),
    entry: component.getAssets().toArray().map(file => file.path),
    output: {
      filename: `${stem}.js`,
      path: `${path.join(basePath)}`
    },
    resolve: {
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
      // FIXME: looping/compiling need to be optimised here
      components = await components.mapAsync(async component => {
        const outputFileSystem = new MemoryFS();
        component.inspector = component.inspector || {};
        const assets = component.getAssets();
        if (!assets) {
          return component;
        }
        assets.toMemoryFS(memoryFs);

        const config = getConfig(component);
        const compiler = webpack(config);
        const pRun = promisify(compiler.run.bind(compiler));

        compiler.inputFileSystem = inputFileSystem;
        compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
        compiler.outputFileSystem = outputFileSystem;

        await pRun().catch(err => {
          debug(`Error running plugin handler: ${err}`);
          return new FileCollection();
        });
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
