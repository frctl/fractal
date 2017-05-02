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

  // load transforms, extensions and commands

  for (const [transform, opts] of resolveConfigItems('transforms')) {
    fractal.addTransform(transform(opts));
  }

  if (config.defaultTransform) {
    fractal.transforms.default = config.defaultTransform;
  }

  for (const [extension, opts] of resolveConfigItems('extensions')) {
    fractal.addExtension(extension(opts));
  }

  for (const [command, opts] of resolveConfigItems('commands')) {
    fractal.addCommand(command(opts));
  }

  // load type-specific plugins and methods

  fractal.transforms.map(trans => trans.name).forEach(type => {
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
