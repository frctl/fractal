const {toArray} = require('@frctl/utils');
const {tryEach} = require('async');

const _stack = new WeakMap();

const noErrMethods = [
  "exists" // exists (no err arg)
];
const fsAsyncMethods = [
  "mkdir", // err
  "readFile", // err, data,
  "writeFile", // err
  "stat", // err, stats
  "readdir", // err, files
  "mkdirp", // err, files
  "rmdir", // err
  "unlink", // err
  "readlink", // err, linkString
];

const fsSyncMethods = [
  "statSync",
  "readdirSync",
  "mkdirpSync",
  "mkdirSync",
  "rmdirSync",
  "unlinkSync",
  "readlinkSync",
  "existsSync",
  "readFileSync",
  "writeFileSync",
  "join",
  "normalize",
  "_remove",
  "meta",
];

class FileSystemStack {

  constructor(fileSystemStack = []) {
    fileSystemStack = toArray(fileSystemStack).map(fileSystem => {
      fileSystem._existsAsync = (path, cb) => {
        fileSystem.exists(path, exists => cb(null, exists));
      };
      return fileSystem;
    });

    _stack.set(this, toArray(fileSystemStack));
  }

  get stack() {
    return _stack.get(this);
  }

}

fsSyncMethods.forEach(method => {
  FileSystemStack.prototype[method] = function(...args) {
    const stack = _stack.get(this);
    for (var i = 0; i < stack.length; i++) {
      try {
        return stack[i][method](...args);
      } catch (err) {
        if (i === stack.length - 1) {
          // last loop
          throw (err);
        }
      }
    }
  };
});

fsAsyncMethods.forEach(method => {
  FileSystemStack.prototype[method] = function(...args) {
    const stack = _stack.get(this);
    const tasks = stack.map(fs => fs[method].bind(fs));

    const callback = args.pop();

    tryEach(tasks, (err, results) => {
      return callback(err, results);
    });
  };
});

FileSystemStack.prototype.exists = function(...args) {
  const stack = _stack.get(this);
  const tasks = stack.map(fs => fs._existsAsync.bind(fs));
  const callback = args.pop();

  tryEach(tasks, (err, results) => {
    return callback(results);
  });
}

module.exports = FileSystemStack;
module.exports.fsSyncMethods = fsSyncMethods;
module.exports.fsAsyncMethods = fsAsyncMethods;
module.exports.noErrMethods = noErrMethods;
