const multimatch = require('multimatch');
const check = require('check-types');
const slash = require('slash');
const File = require('../entities/file');
const EntityCollection = require('./entity-collection');
const Collection = require('./collection');

const assert = check.assert;

class FileCollection extends EntityCollection {

  filterByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `FileCollection.filterByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(file => {
      return multimatch([slash(file.relative)], paths).length;
    });

    return new FileCollection(items);
  }

  rejectByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `ComponentCollection.rejectByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(file => {
      return !multimatch([slash(file.relative)], paths).length;
    });

    return new FileCollection(items);
  }

  _validateOrThrow(items) {
    const isValid = FileCollection.validate(items);
    assert(isValid, `FileCollection.constructor: The 'items' argument is optional but must be an array of Files [items-invalid]`, TypeError);
    return isValid;
  }

  _castItems(items) {
    return items.map(i => File.from(i));
  }

  get [Symbol.toStringTag]() {
    return 'FileCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, File);
  }
}

Collection.addEntityDefinition(File, FileCollection);
Collection.addTagDefinition('FileCollection', FileCollection);

module.exports = FileCollection;
