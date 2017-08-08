const multimatch = require('multimatch');
const assert = require('check-types').assert;
const slash = require('slash');
const File = require('./file');
const Collection = require('./collection');

class FileCollection extends Collection {

  constructor(items = []) {
    assert.maybe.array.of.instance(items, File, `FileCollection.constructor: The 'items' argument is optional but must be an array of Files [items-invalid]`);
    super(items);
  }

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

  toJSON() {
    return this._items.map(file => file.toJSON());
  }

  get [Symbol.toStringTag]() {
    return 'FileCollection';
  }

}
module.exports = FileCollection;
