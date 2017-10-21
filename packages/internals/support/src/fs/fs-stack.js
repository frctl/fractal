const {toArray} = require('@frctl/utils');
const {tryEach} = require('async');
const debug = require('debug')('frctl:fs');

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
    const callback0 = args.pop();
    const tasks = stack.map(fs => callback => {
      fs[method](...args, callback);
    });

    tryEach(tasks, (err, results)=>{
      if (err) debug(`[${method}(${args})]: ${err}`);
      if (results) debug(`[${method}(${args})]: ${results}`);
      callback0(err, results);
    });
  };
});

FileSystemStack.prototype.exists = function(...args) {
  const stack = _stack.get(this);
  const callback0 = args.pop();
  const tasks = stack.map(fs => callback => {
    fs._existsAsync(...args, callback);
  });
  tryEach(tasks, (err, results)=>{
    if (err) debug(`Error [${method}]: ${err}`);
    if (results) debug(`Results [${method}]: ${results}`);
    callback0(err, results);
  });
}

module.exports = FileSystemStack;
module.exports.fsSyncMethods = fsSyncMethods;
module.exports.fsAsyncMethods = fsAsyncMethods;
module.exports.noErrMethods = noErrMethods;
