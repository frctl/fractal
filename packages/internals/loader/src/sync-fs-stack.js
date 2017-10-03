const {toArray} = require('@frctl/utils');

const _stack = new WeakMap();
const fsSyncMethods = [
  'existsSync',
  'statSync',
  'readFileSync',
  'readdirSync',
  'mkdirpSync',
  'mkdirSync',
  'rmdirSync',
  'unlinkSync',
  'readlinkSync',
  'writeFileSync'
];

class SyncFileSystemStack {

  constructor(fileSystemStack = []) {
    _stack.set(this, toArray(fileSystemStack));
  }

  get stack() {
    return _stack.get(this);
  }

}

fsSyncMethods.forEach(method => {
  SyncFileSystemStack.prototype[method] = function (...args) {
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

module.exports = SyncFileSystemStack;
