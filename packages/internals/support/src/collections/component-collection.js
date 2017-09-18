const multimatch = require('multimatch');
const check = require('check-types');
const slash = require('slash');
const Component = require('../entities/component');
const EntityCollection = require('./entity-collection');
const Collection = require('./collection');

const assert = check.assert;

class ComponentCollection extends EntityCollection {

  /*
   * find('name')
   * find('prop', value)
   * find({prop: value})
   * find(fn)
   */
  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('name', args[0]);
    }
    return super.find(...args);
  }

  filterByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `ComponentCollection.filterByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(component => {
      return multimatch([slash(component.relative)], paths).length;
    });
    return new ComponentCollection(items);
  }

  rejectByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `ComponentCollection.rejectByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(component => {
      return !multimatch([slash(component.relative)], paths).length;
    });

    return new ComponentCollection(items);
  }

  _castItems(items) {
    return items.map(i => Component.from(i));
  }

  _validateOrThrow(items) {
    const isValid = ComponentCollection.validate(items);
    assert(isValid, `ComponentCollection.constructor: The 'items' argument is optional but must be an array of Components [items-invalid]`, TypeError);
    return isValid;
  }

  get [Symbol.toStringTag]() {
    return 'ComponentCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, Component);
  }

}

Collection.addEntityDefinition(Component, ComponentCollection);
Collection.addTagDefinition('ComponentCollection', ComponentCollection);

module.exports = ComponentCollection;
