const webpack = require('webpack');
const {promisify} = require('@frctl/utils');
const {FileCollection} = require('../../../internals/support');

const getConfig = component => ({
  context: '/',
  entry: component.getAssets('scripts')
    .toArray()
    .reduce((acc, file)=> {acc[file.stem] = `${file.path}`; return acc;}, {}),
  output: {
    filename: '[name].js',
    path: '/'
  },
  resolve: {
    modules: ['/']
  }
})


module.exports = function (opts = {}) {
  return {

    name: 'inspector-assets',

    transform: 'components',

    async handler(components, state, app) {
      
      const promises = {};

      components = await components.mapAsync(async component => {
        const outputFs = new FileCollection().toMemoryFS();
        component.inspector = component.inspector || {};
        const js = component.getAssets('scripts');
        if (!js) return component;
        const jsFs = js.toMemoryFS();

        const config = getConfig(component);
        const compiler = webpack(config);
        const prun = promisify(compiler.run.bind(compiler));

        compiler.inputFileSystem = jsFs;
        compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
        compiler.outputFileSystem = outputFs;

        const result = await prun().catch(e=> {console.log('ERROR::',e); return new FileCollection()});

        component.inspector.assets = outputFs.data;
        return component;
      });

      return components;
    }

  };
};
