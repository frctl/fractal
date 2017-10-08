/* eslint import/no-unresolved: off */

const {expect} = require('../../../../test/helpers');
const SyncFileSystemStack = require('./sync-fs-stack');

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

const makeFS = throwErr => {
  const fs = {
    called: null
  };
  for (const method of fsSyncMethods) {
    fs[method] = function () {
      this.called = method;
      if (throwErr) {
        throw new Error('oops');
      }
    };
  }
  return fs;
};

describe('SyncFileSystemStack', function () {
  for (const fsMethod of fsSyncMethods) {
    describe(`.${fsMethod}()`, function () {
      it('calls the methods on each obj in the stack until one does not throw an error', function () {
        const fs1 = makeFS(true);
        const fs2 = makeFS(true);
        const fs3 = makeFS(false);
        const fs4 = makeFS(false);
        const stack = new SyncFileSystemStack([fs1, fs2, fs3, fs4]);
        stack[fsMethod]();
        expect(fs1.called).to.equal(fsMethod);
        expect(fs2.called).to.equal(fsMethod);
        expect(fs3.called).to.equal(fsMethod);
        expect(fs4.called).to.equal(null);
      });
    });
  }
});
