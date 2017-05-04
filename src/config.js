const loader = require('@frctl/utils/load');

const appliedPresets = [];

module.exports = {

  src: function (src, key, app) {
    if (src) {
      app.addSrc(src);
    }
  },

  presets: function (items = [], key, app) {
    const presets = loader.resolve(items);
    for (const [fn, opts] of presets) {
      const preset = fn(opts);
      if (appliedPresets.includes(fn)) {
        continue; // skip preset if it's already been applied
      }
      appliedPresets.push(fn);
      app.configure(preset);
    }
  },

  transforms: function (items = [], key, app) {
    const transforms = loader.resolve(items);
    for (const [transform, opts] of transforms) {
      app.addTransform(transform(opts));
    }
  },

  'defaults.transform': function (value, key, app) {
    if (value) {
      app.transforms.default = value;
    }
  },

  plugins: function (plugins = {}, key, app) {
    for (const transform of app.transforms) {
      if (Array.isArray(plugins[transform.name])) {
        for (const [plugin, opts] of loader.resolve(plugins[transform.name])) {
          app.addPlugin(plugin(opts), transform.name);
        }
      }
    }
  },

  methods: function (methods = {}, key, app) {
    for (const transform of app.transforms) {
      if (Array.isArray(methods[transform.name])) {
        for (const [method, opts] of loader.resolve(methods[transform.name])) {
          const mth = method(opts);
          app.addMethod(mth.name, mth.handler, transform.name);
        }
      }
    }
  },

  extensions: function (items = [], key, app) {
    const extensions = loader.resolve(items);
    for (const [extension, opts] of extensions) {
      app.addExtension(extension(opts));
    }
  }

};
