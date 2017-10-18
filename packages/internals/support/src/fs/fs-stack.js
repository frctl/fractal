const {toArray} = require('@frctl/utils');

const _stack = new WeakMap();
const fsMethods = [
  "statSync",
  "readdirSync",
  "mkdirpSync",
  "mkdirSync",
  "rmdirSync",
  "unlinkSync",
  "readlinkSync",

  "stat",
  "readdir",
  "mkdirp",
  "mkdir",
  "rmdir",
  "unlink",
  "readlink",

  "meta",
  "existsSync",
  "readFileSync",
  "_remove",
  "writeFileSync",
  "join",
  "normalize",
  "exists",
  "readFile",
  "writeFile",
];

class FileSystemStack {

  constructor(fileSystemStack = []) {
    _stack.set(this, toArray(fileSystemStack));
  }

  get stack() {
    return _stack.get(this);
  }

}

fsMethods.forEach(method => {
  FileSystemStack.prototype[method] = function (...args) {
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

module.exports = FileSystemStack;
