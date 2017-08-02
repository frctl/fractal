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
    args.reverse().map(item => _.cloneDeep(item)).forEach(item => {
      _.mergeWith(output, item, (objectValue, sourceValue) => {
        if (_.isArray(sourceValue)) {
          return sourceValue;
        }
        if (!_.isPlainObject(sourceValue) || !_.isPlainObject(objectValue)) {
          return sourceValue;
        }
        if (_.isUndefined(sourceValue)) {
          return objectValue;
        }
      });
    });
    return output;
  },

  toJSON(item) {
    if (item && typeof item.toJSON === 'function') {
      return item.toJSON();
    }
    return item;
  },

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
      let suffix = 0;
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
  }

};
