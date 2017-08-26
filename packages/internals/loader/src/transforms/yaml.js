const debug = require('debug')('frctl:loader');
const YAML = require('js-yaml');

module.exports = {
  name: 'YAML',
  match: ['.yml', '.yaml'],
  transform(contents, path) {
    debug(`transforming '%s' using %s transformer`, path, this.name);
    return YAML.safeLoad(contents);
  }
};
