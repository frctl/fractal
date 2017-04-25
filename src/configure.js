const assert = require('check-types').assert;
const utils = require('@frctl/utils');
const loader = require('@frctl/utils/load');

const resolve = ['adapters', 'extensions', 'plugins', 'methods', 'commands', 'presets'];

const configure = module.exports = function (fractal, config = {}, appliedPresets = []) {
  resolve.forEach(name => {
    if (!config[name]) {
      return;
    }

    assert.array(config[name], `Configuration for ${name} must be provided as an array`);
    config[name] = config[name].map(item => {
      item = utils.toArray(item);
      if (typeof item[0] === 'string') {
        item[0] = loader.reqwire(item[0]);
      }
      if (typeof item[1] === 'string') {
        item[2] = item[1];
        item[1] = {};
      }
      assert.function(item[0], `${name} handler must be a function`);
      assert.maybe.object(item[1], `'${name}' configuration must be an object if supplied`);
      return item;
    });
  });

  if (config.presets && config.presets.length > 0) {
    for (const [fn, opts] of config.presets) {
      const preset = fn(opts);
      if (appliedPresets.includes(fn)) {
        continue; // skip preset if it's already been applied
      }
      appliedPresets.push(fn);
      configure(fractal, preset, appliedPresets);
    }
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

  for (const [adapter, opts] of config.adapters || []) {
    fractal.addAdapter(adapter(opts));
  }

  for (const [extension, opts] of config.extensions || []) {
    fractal.addExtension(extension(opts));
  }

  for (const [command, opts] of config.commands || []) {
    fractal.addCommand(command(opts));
  }

  for (const [plugin, opts, target] of config.plugins || []) {
    fractal.addPlugin(plugin(opts), target);
  }

  for (const [method, opts, target] of config.methods || []) {
    const props = method(opts);
    fractal.addMethod(props.name, props.handler, target);
  }

  return fractal;
};
