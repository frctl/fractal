const {clone, isFunction} = require('lodash');
const {Validator, File} = require('@frctl/support');
const {toArray, normalizeExt} = require('@frctl/utils');
const adapterSchema = require('./adapter.schema');

module.exports = function (props) {
  Validator.assertValid(props, adapterSchema, 'Adapter schema invalid [adapter-invalid]: ');

  const adapter = clone(props);

  const match = isFunction(props.match) ? props.match : toArray(props.match).map(ext => normalizeExt(ext));

  adapter.match = function (file) {
    if (!File.isFile(file)) {
      throw new TypeError(`Adapters can only match against File objects [file-invalid]`);
    }
    if (typeof match === 'function') {
      return match(file);
    }
    return match.includes(normalizeExt(file.extname));
  };

  return adapter;
};
