const multimatch = require('multimatch');
const check = require('check-types');
const slash = require('slash');
const MemoryFS = require('memory-fs');
const File = require('../entities/file');
const EntityCollection = require('./entity-collection');
const Collection = require('./collection');

const assert = check.assert;
const fsReadMethods = [
  'existsSync',
  'statSync',
  'readFileSync',
  'readdirSync',
  'readlinkSync',
  'stat',
  'readdir',
  'readlink',
  'readFile',
  'exists'
];

class FileCollection extends EntityCollection {

  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('relative', args[0]);
    }
    return super.find(...args);
  }

  filter(...args) {
    if (args.length === 1 && (typeof args[0] === 'string' || Array.isArray(args[0]))) {
      return this.filterByPath(...args);
    }
    return new FileCollection(super.filter(...args).toArray());
  }

  reject(...args) {
    if (args.length === 1 && (typeof args[0] === 'string' || Array.isArray(args[0]))) {
      return this.rejectByPath(...args);
    }
    return new FileCollection(super.reject(...args).toArray());
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

  toMemoryFS() {
    // TODO: can we cache this MemoryFs instance creation somehow?
    const memFs = new MemoryFS();
    const errors = [];
    this.sortBy(file => file.path.length).forEach(file => {
      try {
        memFs.mkdirpSync(file.dirname);
        memFs.writeFileSync(file.path, file.contents);
      } catch (err) {
        errors.push(err);
      }
    });
    if (errors.length > 0) {
      throw new Error(`Could not create MemoryFS instance [memfs-error]`);
    }
    return memFs;
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

for (const fsMethod of fsReadMethods) {
  FileCollection.prototype[fsMethod] = function (...args) {
    const fs = this.toMemoryFS();
    return fs[fsMethod].bind(fs)(...args);
  };
}

Collection.addEntityDefinition(File, FileCollection);
Collection.addTagDefinition('FileCollection', FileCollection);

module.exports = FileCollection;
