const multimatch = require('multimatch');
const check = require('check-types');
const slash = require('slash');
const MemoryFS = require('memory-fs');
const File = require('../entities/file');
const EntityCollection = require('./entity-collection');

const assert = check.assert;

class FileCollection extends EntityCollection {

  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find(file => slash(file.relative) === slash(args[0]));
    }
    return super.find(...args);
  }

  filter(...args) {
    if (args.length === 1 && (typeof args[0] === 'string' || Array.isArray(args[0]))) {
      return this.filterByPath(...args);
    }
    return new this.constructor(super.filter(...args).toArray());
  }

  reject(...args) {
    if (args.length === 1 && (typeof args[0] === 'string' || Array.isArray(args[0]))) {
      return this.rejectByPath(...args);
    }
    return new this.constructor(super.reject(...args).toArray());
  }

  filterByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `FileCollection.filterByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(file => {
      return multimatch([slash(file.relative)], paths).length;
    });

    return new this.constructor(items);
  }

  rejectByPath(...args) {
    let paths = [].concat(...args);
    assert.array.of.string(paths, `ComponentCollection.rejectByPath: path argument must be a string or array of strings [paths-invalid]`);
    paths = paths.map(path => slash(path));

    const items = this._items.filter(file => {
      return !multimatch([slash(file.relative)], paths).length;
    });

    return new this.constructor(items);
  }

  toMemoryFS() {
    // TODO: can we cache this MemoryFs instance creation somehow?
    const memFs = new MemoryFS();
    const errors = [];
    this.clone().filter(file => !file.isDirectory()).sortBy(file => file.path.length).forEach(file => {
      try {
        memFs.mkdirpSync(slash(file.dirname));
        memFs.writeFileSync(slash(file.path), file.contents);
      } catch (err) {
        errors.push(err);
      }
    });
    if (errors.length > 0) {
      throw new Error(`Could not create MemoryFS instance [memfs-error]\n  ${errors.join('\n')}`);
    }
    return memFs;
  }

  get [Symbol.toStringTag]() {
    return 'FileCollection';
  }

}

FileCollection.entity = File;

module.exports = FileCollection;
