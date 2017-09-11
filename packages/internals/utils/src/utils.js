/* eslint import/no-dynamic-require: "off" */
const path = require('path');
const _ = require('lodash');
const slug = require('slugify');
const assert = require('check-types').assert;
const resolveDeep = require('deep-aplus')(Promise);
const slash = require('slash');
const pify = require('pify');

const utils = module.exports = {

  /*
   * Objects
   */

  defaultsDeep(...args) {
    let output = {};
    let customizer;
    args = _.compact(args);
    if (typeof args[args.length - 1] === 'function') {
      const fn = args.pop();
      customizer = (defaultValue, targetValue, ...other) => fn(targetValue, defaultValue, ...other);
    } else {
      customizer = (defaultValue, targetValue) => {
        if (Array.isArray(targetValue)) {
           // don't merge arrays - the target array overrides the default value
          return targetValue;
        }
      };
    }
    const items = args.reverse().map(item => _.cloneDeep(item));
    items.forEach(item => _.mergeWith(output, item, customizer));
    return output;
  },

  toJSON(item) {
    if (item && typeof item.toJSON === 'function') {
      return item.toJSON();
    }
    return item;
  },

  // TODO: Consider renaming to clarify function: resolve Function or Object
  async resolveDeep(target, ...args) {
    target = await Promise.resolve(target);
    if (_.isPlainObject(target)) {
      return resolveDeep(target);
    }
    if (typeof target === 'function') {
      const result = await Promise.resolve(target(...args));
      if (_.isPlainObject(result)) {
        return resolveDeep(result);
      }
    }
    throw new Error('Can only resolve objects or functions/promises that return an object');
  },

  cloneDeep(target) {
    if (!target || !_.isObject(target) || _.isFunction(target)) {
      return target;
    }
    return _.cloneDeepWith(target, value => {
      if (value && typeof value.clone === 'function') {
        return value.clone();
      }
    });
  },

  /*
   * Strings
   */

  slugify(str, replacement) {
    return slug(str.toLowerCase(), replacement || '-');
  },

  titlize(str) {
    return require('titlecase')(str.replace(/[-_]/g, ' '));
  },

  normalizeName(str) {
    return _.kebabCase(str.replace(/^[^a-zA-Z]*/, ''));
  },

  uniqueName(name, used) {
    assert.array(used, 'You must provide an array to use when checking names for uniqueness [no-used-array]');
    let id = name;
    if (used.includes(id)) {
      // id already exists, add a suffix to make it unique
      let suffix = 1;
      while (used.includes(id)) {
        suffix++;
        id = `${name}-${suffix}`;
      }
    }
    used.push(id);
    return id;
  },

  hash(content) {
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    return require('crypto').createHash('md5').update(content).digest('hex');
  },

  matches(paths, patterns, caseSensitive = false) {
    const mm = require('multimatch');
    const matches = mm(utils.toArray(paths), utils.toArray(patterns), {
      nocase: !caseSensitive
    });
    return matches && matches.length > 0;
  },

  splitLines(str) {
    return str.split(/\r?\n/);
  },

  /*
   * Paths
   */

  addTrailingSeparator(str) {
    return path.join(str, path.sep);
  },

  removeTrailingSeparator(str) {
    while (utils.endsInSeparator(str)) {
      str = str.slice(0, -1);
    }
    return str;
  },

  endsInSeparator(str) {
    const last = str[str.length - 1];
    return str.length > 1 && (last === '/' || (utils.isWin() && last === '\\'));
  },

  normalizeExt(ext) {
    return `.${ext.toLowerCase().replace(/^\./, '')}`;
  },

  removeExt(str) {
    const parts = path.parse(str);
    return path.join(parts.dir, parts.name);
  },

  getExt(filePath) {
    return path.extname(filePath);
  },

  normalizePath(filePath, cwd) {
    assert.string(filePath, `Path must be a string. Received '${typeof filePath}' [paths-invalid]`);
    cwd = cwd || process.cwd();

    if (!path.isAbsolute(filePath)) {
      filePath = path.join(cwd, filePath);
    }
    filePath = utils.removeTrailingSeparator(slash(filePath));
    return path.normalize(filePath);
  },

  normalizePaths(paths, cwd) {
    paths = utils.toArray(paths);
    return paths.map(filePath => utils.normalizePath(filePath, cwd));
  },

  permalinkify(str, opts = {}) {
    const fallbackExt = utils.normalizeExt(opts.ext || '.html');
    const indexes = opts.indexes || false;
    let permalink = _.trim(slash(str), '/');
    permalink = permalink === '' ? 'index' + fallbackExt : permalink;
    if (!path.extname(permalink)) {
      permalink += (indexes && !/\/?index$/.test(permalink) ? '/index' : '') + fallbackExt;
    }
    return '/' + permalink;
  },

  /*
   * Other
   */

  promisify(fn, opts) {
    return pify(fn, opts);
  },

  toArray(args) {
    if (args === null || args === undefined) {
      return [];
    }
    return [].concat(args);
  },

  isWin() {
    return process.platform === 'win32';
  },

  concatIfArrays(targetValue, defaultValue) {
    if (Array.isArray(defaultValue) && Array.isArray(targetValue)) {
      return targetValue.concat(defaultValue);
    }
  }

};
