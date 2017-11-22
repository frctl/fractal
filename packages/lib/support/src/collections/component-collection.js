const multimatch = require('multimatch');
const check = require('check-types');
const slash = require('slash');
const Component = require('../entities/component');
const EntityCollection = require('./entity-collection');

const assert = check.assert;

class ComponentCollection extends EntityCollection {

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

  filterByTag(tagName) {
    const items = this._items.filter(component => {
      return Array.isArray(component.tags) && component.tags.includes(tagName);
    });
    return new ComponentCollection(items);
  }

  rejectByTag(tagName) {
    const items = this._items.filter(component => {
      return !(component.tags || []).includes(tagName);
    });
    return new ComponentCollection(items);
  }

  getComponentForVariant(variant) {
    return super.find(component => {
      const variantRefs = component.getVariants().mapToArray(v => v.uuid);
      return variantRefs.includes(variant.uuid);
    });
  }

  get [Symbol.toStringTag]() {
    return 'ComponentCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, Component);
  }

}

ComponentCollection.entity = Component;

module.exports = ComponentCollection;
