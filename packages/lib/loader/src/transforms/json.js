const debug = require('debug')('frctl:loader');
const JSON5 = require('json5');

module.exports = {
  name: 'JSON',
  match: ['.json', '.json5'],
  transform(contents, path) {
    debug(`transforming '%s' using %s transformer`, path, this.name);
    return JSON5.parse(contents);
  }
};
