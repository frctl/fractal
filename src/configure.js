const _ = require('lodash');
const assert = require('check-types').assert;
const utils = require('@frctl/utils');
const loader = require('@frctl/utils/load');

const configure = module.exports = function (fractal, config = {}, appliedPresets = []) {

  function resolveConfig(path) {
    const items = _.get(config, path, []);
    assert.array(items, `Configuration for ${path} must be provided as an array`);
    return items.map(item => {
      let [pkg, config, ...args] = utils.toArray(item);
      if (typeof pkg === 'string') {
        pkg = loader.reqwire(pkg);
      }

      assert.function(pkg, `${path} loading error - package must be a function`);

      if (!_.isPlainObject(config)) {
        args.unshift(config);
        config = {};
      }

      return [pkg, config, ...args];
    });
  }

  // apply any presets first

  const presets = resolveConfig('presets');

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

  for (const [adapter, opts] of resolveConfig('adapters')) {
    fractal.addAdapter(adapter(opts));
  }

  for (const [extension, opts] of resolveConfig('extensions')) {
    fractal.addExtension(extension(opts));
  }

  for (const [command, opts] of resolveConfig('commands')) {
    fractal.addCommand(command(opts));
  }

  // load type-specific plugins and methods

  ['files', 'components'].forEach(type => {

    for (const [plugin, opts] of resolveConfig(`plugins.${type}`)) {
      fractal.addPlugin(plugin(opts), type);
    }

    for (const [method, opts, target] of resolveConfig(`methods.${type}`)) {
      const props = method(opts);
      fractal.addMethod(props.name, props.handler, type);
    }

  });

  return fractal;
};
