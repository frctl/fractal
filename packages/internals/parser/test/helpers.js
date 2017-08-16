const {Collection, FileCollection, ComponentCollection, Component, File} = require('@frctl/support');

const toFC = i => new FileCollection(i);
const toC = i => new Collection(i);
const toCC = i => new ComponentCollection(i);

const makePlugin = (name = 'plugin-name', type = 'files', handler = i => i) => ({
  name: name,
  collection: type,
  handler: handler
});

const makeTransform = (name = 'tranform-name', transformFunc = toC, plugins = undefined, passthru = false) => {
  const transform = {
    name: name,
    passthru: passthru,
    transform: transformFunc
  };
  if (plugins) {
    transform.plugins = plugins;
  }
  return transform;
};

const validPlugin = makePlugin('valid-plugin');
const validPluginList = [
  makePlugin('valid-plugin-1'),
  makePlugin('valid-plugin-2', 'components'),
  makePlugin('valid-plugin-3')
];
const invalidPlugin = {
  handler: i => i
};
const validPluginWithInvalidReturnValue = makePlugin(
  'plugin-invalid-return', 'files', items => items.reduce((i, prev) => Boolean(i && prev), true)
);

const validCollectionTransform = makeTransform('valid-transform');
const validFileCollectionTransform = makeTransform('valid-file-collection-transform', toFC, null, true);
const validComponentCollectionTransform = makeTransform('valid-component-collection-transform', toCC, null);
const invalidTransform = {name: 'transform without required props'};
const validTransformWithPlugin = makeTransform('valid-transform-with-plugin', toC, validPlugin);
const validTransformWithPluginList = makeTransform('valid-transform-with-plugin-list', toC, validPluginList);


const filesToComponents = files => {
  const comps = files.toArray().map(f => {
    return new Component({
      src: new File({path: f.dirname}),
      name: f.stem
    });
  });
  return ComponentCollection.from(comps);
};

const filesToComponentsTransform = {
  name: 'files-to-comps',
  transform: filesToComponents,
  plugins: {
    name: 'plugin-status',
    collection: 'files',
    handler: items => items.map(i => Object.assign(i, {
      ready: true
    }))
  }
};

module.exports = {
  makePlugin: makePlugin,
  makeTransform: makeTransform,
  validPlugin: validPlugin,
  validPluginList: validPluginList,
  invalidPlugin: invalidPlugin,
  validPluginWithInvalidReturnValue: validPluginWithInvalidReturnValue,
  validCollectionTransform: validCollectionTransform,
  validFileCollectionTransform: validFileCollectionTransform,
  validComponentCollectionTransform: validComponentCollectionTransform,
  invalidTransform: invalidTransform,
  validTransformWithPlugin: validTransformWithPlugin,
  validTransformWithPluginList: validTransformWithPluginList,
  filesToComponentsTransform: filesToComponentsTransform,
  filesToComponents: filesToComponents,
  toFC: toFC,
  toC: toC,
  toCC: toCC
};
