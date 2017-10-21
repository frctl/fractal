const util = require('util');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const fs = require('fs');
const {promisify} = require('@frctl/utils');
const {FileCollection, FileSystemStack} = require('@frctl/support');
const SyncFileSystemStack = require('../../../internals/loader/src/sync-fs-stack.js')
const debug = require('debug')('frctl:plugin:inspector-assets');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');
const extractSASS = new ExtractTextPlugin('stylesheets/[name]-two.css');


const getConfig = component => {
  const basePath = component.getSrc().path;
  return {
    context: '/',
    entry: component.getAssets()
      .toArray()
      .reduce((acc, file) => {
        console.log(`${file.path}`)
        acc[`${file.stem}${file.extname}`] = `${file.path}`;
        return acc;
      }, {}),
    output: {
      filename: '[name]',
      path: `${basePath}`
    },
    resolve: {
      modules: ['../node_modules']
    },
    module: {

    rules: [
      { // regular css files
        test: /\.css$/,
        use: extractCSS.extract(['css-loader']),
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        use: extractSASS.extract(['css-loader', 'sass-loader'])
      },
      {
      test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractCSS,
    extractSASS
  ],
  }
};

const memoryFs = new MemoryFS();
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
        if (!assets) return component;
        assets.toMemoryFS(memoryFs);

        const config = getConfig(component);
        const compiler = webpack(config);
        const pRun = promisify(compiler.run.bind(compiler));

        compiler.inputFileSystem = inputFileSystem;
        compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
        compiler.outputFileSystem = outputFileSystem;

        const result = await pRun().catch(e => {debug(`Error running plugin handler: ${e}`); return new FileCollection()});

        component.inspector.assets = await FileCollection.fromMemoryFS(outputFileSystem); // TODO: should this overwrite, or merge in some way?
        debug(`

component: ${util.inspect(component.inspector.assets, {showHidden: false, depth:4})}

`);
        return component;
      });

      return components;
    }

  };
};
