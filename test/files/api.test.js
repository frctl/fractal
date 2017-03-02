/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const expect = require('@frctl/utils/test').expect;
const File = require('@frctl/ffs').File;
const Fractal = require('../../src/fractal');

describe('files API object', function () {
  let files;

  before(function (done) {
    const fractal = new Fractal({
      src: './test/fixtures/components'
    });
    fractal.parse((...args) => {
      [,, files] = args;
      done();
    });
  });

  it(`is an object`, function () {
    expect(files).to.be.an('object');
  });

  describe('.getAll()', function () {
    it(`returns an array of files`, function () {
      const result = files.getAll();
      expect(result).to.be.an('array');
      for (const file of result) {
        expect(file).to.be.an.instanceof(File);
      }
    });
  });

  describe('.filterByRole()', function () {
    it(`returns an empty array if no files match the role`, function () {
      const result = files.filterByRole('foobar');
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });
    it(`returns an array of files filtered by the role property`, function () {
      for (const role of ['config', 'component', 'view']) {
        const result = files.filterByRole(role);
        expect(result).to.be.an('array');
        for (const file of result) {
          expect(file).to.be.an.instanceof(File);
          expect(file.role).to.equal(role);
        }
      }
    });
  });

  describe('.filterByPath()', function () {
    it(`returns an empty array if no files match the path`, function () {
      const result = files.filterByPath('foobar/baz');
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    });
    // it(`accepts a single path`, function () {
    //   const result = files.filterByPath('foobar/baz');
    // });
    // it(`accepts an array of paths`, function () {
    //   const result = files.filterByPath('foobar/baz');
    // });
  });
});
