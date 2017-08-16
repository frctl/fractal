/* eslint handle-callback-err: off, no-unused-expressions: off, max-nested-callbacks: "off" */
const Vinyl = require('vinyl');
const mockFs = require('mock-fs');
const {EventEmitter2} = require('eventemitter2');
const {expect, sinon} = require('../../../../test/helpers');
const read = require('./read');

describe(`'read' function`, function () {
  before(function () {
    mockFs({
      'path/to/fake/dir': {
        'some-file.txt': 'file content here',
        'empty-dir': {/** empty directory */}
      },
      'path/to/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
      'some/other/path': {
        'other-file.txt': 'file content here',
        'other-dir': {/** empty directory */}
      }
    });
  });

  after(function () {
    mockFs.restore();
  });

  describe.only('factory', function () {
    it('is exported as an async function', async function () {
      expect(read).to.be.a('Function');
      expect(read()).to.be.a('Promise');
      expect(await read()).to.be.an('array').that.eqls([]);
    });
    it('only accepts valid arguments', async function () {
      expect(await read([])).to.be.an('array').that.eqls([]);
      expect(await read({})).to.be.an('array').that.eqls([]);

      await read({invalid: 'source'})
      .catch(err => {
        expect(() => {
          throw err;
        }).to.throw(TypeError, '[invalid-sources]');
      });
    });
    it('converts an array of source objects into an array of Vinyl Files', async function () {
      const result = await read([{src: 'path/to/fake/dir/some-file.txt'}]);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(1);
      expect(Vinyl.isVinyl(result[0])).to.be.true;
    });
    it('converts an array of source objects with glob format into an array of Vinyl Files', async function () {
      const result = await read([{src: 'path/to/fake/dir/**'}]);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(3);
      expect(Vinyl.isVinyl(result[2])).to.be.true;
    });
    it('converts an array of source objects with glob format into an array of Vinyl Files', async function () {
      const result = await read([{src: 'path/to/fake/dir/**'}, {src: 'some/other/path/**'}]);
      expect(result).to.be.an('array');
      expect(result.length).to.equal(6);
      expect(Vinyl.isVinyl(result[5])).to.be.true;
    });
    it('emits expected events when an emitter is provided', async function () {
      const emitter = new EventEmitter2();

      let count = 0;
      emitter.on('read.start', function(fileStream){
        count++;
        expect(fileStream).to.exist;
      });
      emitter.on('read.file', function(file){
        count++;
        expect(file).to.exist;
        expect(Vinyl.isVinyl(file)).to.be.true;
      })
      emitter.on('read.complete', function(files){
        count++;
        expect(files).to.exist;
        expect(files).to.be.an('array');
        expect(count).to.equal(5);
      });
      const emitSpy = sinon.spy(emitter, 'emit');
      await read([{src: 'path/to/fake/dir/**'}], emitter);
      expect(emitSpy.callCount).to.equal(5);
    });
  });
});
