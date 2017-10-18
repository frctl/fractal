const util = require('util');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const fs = require('fs');
const {promisify} = require('@frctl/utils');
const {FileCollection, FileSystemStack} = require('@frctl/support');
const SyncFileSystemStack = require('../../../internals/loader/src/sync-fs-stack.js')

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: process.env.NODE_ENV === 'development'
});

const getConfig = component => {
  const basePath = component.getSrc().path;
  return {
    context: '/',
    entry: component.getAssets()
      .toArray()
      .reduce((acc, file) => {
        acc[`${file.stem}${file.extname}`] = `${file.path}`;
        return acc;
      }, {}),
    output: {
      filename: '[name]',
      path: `${basePath}`
    },
    resolve: {
      modules: ['/']
    },
    module: {

    rules: [
      { // regular css files
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(['css-loader']),
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: `${basePath}/[name].css`,
      allChunks: true,
    }),
  ],
  }
};

const memoryFs = new MemoryFS();
// packagePreloader(inputFileSystem, ['css-loader', 'sass-loader', 'file-loader', 'extract-text-webpack-plugin']);
const inputFileSystem = new FileSystemStack([memoryFs, fs]);

module.exports = function (opts = {}) {

  return {

    name: 'inspector-assets',

    transform: 'components',

    async handler(components, state, app) {

      components = await components.mapAsync(async component => {
        const outputFileSystem = new MemoryFS();
        component.inspector = component.inspector || {};
        const assets = component.getAssets();
        // console.log(assets);
        if (!assets) return component;
        assets.toMemoryFS(memoryFs);

        const config = getConfig(component);
        const compiler = webpack(config);
        const pRun = promisify(compiler.run.bind(compiler));

        compiler.inputFileSystem = inputFileSystem;
        compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
        compiler.outputFileSystem = outputFileSystem;

        const result = await pRun().catch(e=> {console.log('ERROR::',e); return new FileCollection()});

        console.log('\n\ncomponent:', util.inspect(outputFileSystem, {showHidden: false, depth:4}));

        component.inspector.assets = await FileCollection.fromMemoryFS(outputFileSystem); // TODO: should this overwrite, or merge in some way?
        return component;
      });

      return components;
    }

  };
};
