/* eslint import/no-unresolved: off */

const {expect} = require('../../../../../test/helpers');
const FileSystemStack = require('./fs-stack');

const fsSyncMethods = [].concat(FileSystemStack.fsSyncMethods);
const fsAsyncMethods = [].concat(FileSystemStack.fsAsyncMethods, FileSystemStack.noErrMethods);

const makeFs = throwErr => {
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
  for (const method of fsAsyncMethods) {
    fs[method] = function (callback) {
      this.called = method;
      if (throwErr) {
        return callback(new Error('oops'));
      }
      callback(null, true);
    };
  }
  return fs;
};

describe('FileSystemStack', function () {
  for (const fsMethod of fsSyncMethods) {
    describe(`.${fsMethod}()`, function () {
      it('calls the sync methods on each obj in the stack until one does not throw an error', function () {
        const fs1 = makeFs(true);
        const fs2 = makeFs(true);
        const fs3 = makeFs(false);
        const fs4 = makeFs(false);
        const stack = new FileSystemStack([fs1, fs2, fs3, fs4]);
        stack[fsMethod]();
        expect(fs1.called).to.equal(fsMethod);
        expect(fs2.called).to.equal(fsMethod);
        expect(fs3.called).to.equal(fsMethod);
        expect(fs4.called).to.equal(null);
      });
    });
  }
  for (const fsMethod of fsAsyncMethods) {
    describe(`.${fsMethod}()`, function () {
      it('calls the async methods on each obj in the stack until one does not throw an error', function (done) {
        const fs1 = makeFs(true);
        const fs2 = makeFs(true);
        const fs3 = makeFs(false);
        const fs4 = makeFs(false);
        const stack = new FileSystemStack([fs1, fs2, fs3, fs4]);
        stack[fsMethod]((err, result) => {
          if (err) {
            return done(err);
          }
          expect(fs1.called).to.equal(fsMethod);
          expect(fs2.called).to.equal(fsMethod);
          expect(fs3.called).to.equal(fsMethod);
          expect(fs4.called).to.equal(null);
          done();
        });
      });
    });
  }
  describe(`.exists()`, function (done) {
    it('calls the async methods on each obj in the stack until one does not throw an error', function (done) {
      const fs1 = makeFs(true);
      const fs2 = makeFs(true);
      const fs3 = makeFs(false);
      const fs4 = makeFs(false);
      const stack = new FileSystemStack([fs1, fs2, fs3, fs4]);
      stack.exists(result => {
        expect(fs1.called).to.equal('exists');
        expect(fs2.called).to.equal('exists');
        expect(fs3.called).to.equal('exists');
        expect(fs4.called).to.equal(null);
        done();
      });
    });
  });
});
