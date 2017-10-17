const webpack = require('webpack');
const {promisify} = require('@frctl/utils');
const {FileCollection} = require('@frctl/support');

const getConfig = component => {
  const basePath = component.getSrc().path;
  return {
    context: '/',
    entry: component.getAssets('scripts')
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
    }
  }
};

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
        const pRun = promisify(compiler.run.bind(compiler));

        compiler.inputFileSystem = jsFs;
        compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
        compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
        compiler.outputFileSystem = outputFs;

        const result = await pRun().catch(e=> {console.log('ERROR::',e); return new FileCollection()});

        component.inspector.assets = await FileCollection.fromMemoryFS(outputFs); // TODO: should this overwrite, or merge in some way?
        return component;
      });

      return components;
    }

  };
};
