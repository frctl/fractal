const multimatch = require('multimatch');
const check = require('check-types');

const slash = require('slash');
const Collection = require('./collection');
const Component = require('./component');

const assert = check.assert;
class ComponentCollection extends Collection {

  /*
   * find('name')
   * find('prop', value)
   * find({prop: value})
   * find(fn)
   */
  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      const lookupParts = args[0].split('/');
      const name = lookupParts.pop();
      const matches = this._items.filter(comp => comp.name === name);

      if (matches.length === 1) {
        return matches[0];
      }

      // TODO: decide if/how we want to support: `find('pathpart/pathend')`
      // if (matches.length > 1 && lookupParts.length > 0) {
      //   const dirpath = join(...lookupParts);
      //   for (const component of matches) {
      //     if (dirname(component.path).endsWith(dirpath)) {
      //       return component;
      //     }
      //   }
      //   return null;
      // }

      return super.find('name', args[0]);
    }

    return super.find(...args);
  }

  filterByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `ComponentCollection.filterByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(file => {
      return multimatch([slash(file.relative)], paths).length;
    });

    return new ComponentCollection(items);
  }

  rejectByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `ComponentCollection.rejectByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(file => {
      return !multimatch([slash(file.relative)], paths).length;
    });

    return new ComponentCollection(items);
  }

  toJSON() {
    return this._items.map(component => component.toJSON());
  }

  validateOrThrow(items) {
    const isValid = ComponentCollection.validate(items);
    assert(isValid, `ComponentCollection.constructor: The 'items' argument is optional but must be an array of Components [items-invalid]`, TypeError);
    return isValid;
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, Component);
  }

  get [Symbol.toStringTag]() {
    return 'ComponentCollection';
  }

}
module.exports = ComponentCollection;
