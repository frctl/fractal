const JSON5 = require('json5');
const YAML = require('js-yaml');

module.exports = function () {
  return {
    name: 'load-config',
    transform: 'files',
    handler: function name(files, state, app) {

      const configFiles = files.filter(app.get('components.config.filter'));

      configFiles.forEach(file => {
        const data = loadDataFromFile(file, app);
        file.data = (typeof data === 'function') ? data(app, files) : data;
      });

      return files;
    }
  };
};

function loadDataFromFile(file, app) {
  try {
    const ext = file.extname.toLowerCase();

    if (ext === '.js') {
      return app.require(file.path);
    }

    if (['.yml', '.yaml'].includes(ext)) {
      return YAML.safeLoad(file.contents.toString());
    }

    if (['.json', '.json5'].includes(ext)) {
      return JSON5.parse(file.contents.toString());
    }
  } catch (err) {
    throw new Error(`Error parsing config file '${file.relative}'\n${err.stack}`);
  }
}
