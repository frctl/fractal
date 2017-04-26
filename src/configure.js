const _ = require('lodash');
const loader = require('@frctl/utils/load');

const configure = module.exports = function (fractal, config = {}, appliedPresets = []) {
  function resolveConfigItems(path) {
    const items = _.get(config, path, []);
    return loader.resolve(items);
  }

  // apply any presets first

  const presets = resolveConfigItems('presets');

  for (const [fn, opts] of presets) {
    const preset = fn(opts);
    if (appliedPresets.includes(fn)) {
      continue; // skip preset if it's already been applied
    }
    appliedPresets.push(fn);
    configure(fractal, preset, appliedPresets);
  }

  if (config.src) {
    fractal.addSrc(config.src);
  }

  if (config.transformer) {
    let transformer = config.transformer;
    if (typeof transformer === 'string') {
      transformer = loader.reqwire(config.transformer);
    }
    fractal.setTransformer(transformer);
  }

  // load adapters, extensions and commands

  for (const [adapter, opts] of resolveConfigItems('adapters')) {
    fractal.addAdapter(adapter(opts));
  }

  for (const [extension, opts] of resolveConfigItems('extensions')) {
    fractal.addExtension(extension(opts));
  }

  for (const [command, opts] of resolveConfigItems('commands')) {
    fractal.addCommand(command(opts));
  }

  // load type-specific plugins and methods

  ['files', 'components'].forEach(type => {
    for (const [plugin, opts] of resolveConfigItems(`plugins.${type}`)) {
      fractal.addPlugin(plugin(opts), type);
    }

    for (const [method, opts] of resolveConfigItems(`methods.${type}`)) {
      const props = method(opts);
      fractal.addMethod(props.name, props.handler, type);
    }
  });

  return fractal;
};
