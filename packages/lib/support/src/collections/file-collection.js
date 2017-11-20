const multimatch = require('multimatch');
const check = require('check-types');
const slash = require('slash');
const MemoryFS = require('memory-fs');
const File = require('../entities/file');
const FileSystemReader = require('../fs/fs-file-reader');
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
      return super.find(file => slash(file.relative) === slash(args[0]));
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

  toMemoryFS(memFs = new MemoryFS()) {
    // TODO: can we cache this MemoryFs instance creation somehow?
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

  _validateOrThrow(items) {
    const isValid = FileCollection.validate(items);
    assert(isValid, `FileCollection.constructor: The 'items' argument is optional but must be an array of Files [items-invalid]`, TypeError);
    return isValid;
  }

  _castItems(items) {
    return items.map(i => new File(i));
  }

  get [Symbol.toStringTag]() {
    return 'FileCollection';
  }

  static validate(items) {
    return check.maybe.array.of.instance(items, File);
  }

  static fromMemoryFS(memFs) {
    const reader = new FileSystemReader(memFs);
    const files = [];
    const errors = [];
    return new Promise((resolve, reject) => {
      reader.readFiles('/', '',
        function (err, content, filename, next) {
          if (err) {
            errors.push(err);
          } else {
            files.push({path: filename, contents: content});
          }
          next();
        },
        function (err, fls) {
          if (err || errors.length > 0) {
            return reject(err || new Error(`Could not create FileCollection from MemoryFS instance [from-memfs-error]\n  ${errors.join('\n')}`));
          }
          resolve(FileCollection.from(files));
        });
    });
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
