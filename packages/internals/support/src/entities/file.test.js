/* eslint no-unused-expressions: "off" */
const fs = require('fs');
const path = require('path');
const Vinyl = require('vinyl');
const {expect, sinon} = require('../../../../../test/helpers');
const File = require('./file');

const fileContents = 'var x = 123';
const stat = fs.statSync('.');
const minFileData = {
  path: '/test/file.js'
};
const baseFileData = {
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer(fileContents)
};
const makeFile = input => new File(input || Object.assign({},minFileData));

describe.only('File', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const file = makeFile();
      expect(file).to.exist;
      expect(file).to.be.a('File');
    });
    it('throws an error if invalid props provided', function() {
      expect(()=>makeFile({})).to.throw(TypeError, '[properties-invalid]')
    });

    it('sets base', function() {
      var val = path.normalize('/');
      var file = makeFile({ path: minFileData.path, base: val });
      expect(file.base).to.equal(val);
    });

    it('sets cwd', function(done) {
      var val = path.normalize('/');
      var file = makeFile({ path: minFileData.path, cwd: val });
      expect(file.cwd).to.equal(val);
      done();
    });

    it('sets path (and history)', function() {
      var val = path.normalize('/test.coffee');
      var file = makeFile({ path: val });
      expect(file.path).to.equal(val);
      expect(file.history).to.eql([val]);
    });

    it('sets history (and path)', function() {
      var val = path.normalize('/test.coffee');
      var file = new File({ history: [val] });
      expect(file.path).to.equal(val);
      expect(file.history).to.eql([val]);
    });

    it('sets stat', function() {
      var val = {};
      var file = makeFile({ path: minFileData.path, stat: val });
      expect(file.stat).to.eql(val);
    });

    it('sets contents', function() {
      var val = new Buffer('test');
      var file = makeFile({ path: minFileData.path, contents: val });
      expect(file.contents).to.eql(val);
    });

    it('sets custom properties', function() {
      var sourceMap = { foo: 'bar'};
      var id = '/comp/e43';
      var file = makeFile({ path: minFileData.path, sourceMap: sourceMap, id: id });
      expect(file.sourceMap).to.eql(sourceMap);
      expect(file.id).to.equal(id);
    });

    it('normalizes path', function() {
      var val = '/test/foo/../test.coffee';
      var expected = path.normalize(val);
      var file = makeFile({ path: val });
      expect(file.path).to.equal(expected);
      expect(file.history).to.eql([expected]);
    });

    it('normalizes and removes trailing separator from path', function() {
      var val = '/test/foo/../foo/';
      var expected = path.normalize(val.slice(0, -1));
      var file = new File({ path: val });
      expect(file.path).to.eql(expected);
    });

    it('normalizes history', function() {
      var val = [
        '/test/bar/../bar/test.coffee',
        '/test/foo/../test.coffee',
      ];
      var expected = val.map(function(p) {
        return path.normalize(p);
      });
      var file = makeFile({ history: val });
      expect(file.path).to.equal(expected[1]);
      expect(file.history).to.eql(expected);
    });

    it('normalizes and removes trailing separator from history', function() {
      var val = [
        '/test/foo/../foo/',
        '/test/bar/../bar/',
      ];
      var expected = val.map(function(p) {
        return path.normalize(p.slice(0, -1));
      });
      var file = makeFile({ history: val });
      expect(file.history).to.eql(expected);
    });

    it('appends path to history if both exist and different from last', function() {
      var val = path.normalize('/test/baz/test.coffee');
      var history = [
        path.normalize('/test/bar/test.coffee'),
        path.normalize('/test/foo/test.coffee'),
      ];
      var file = makeFile({ path: val, history: history });

      var expectedHistory = history.concat(val);

      expect(file.path).to.equal(val);
      expect(file.history).to.eql(expectedHistory);
    });

    it('does not append path to history if both exist and same as last', function() {
      var val = path.normalize('/test/baz/test.coffee');
      var history = [
        path.normalize('/test/bar/test.coffee'),
        path.normalize('/test/foo/test.coffee'),
        val,
      ];
      var file = makeFile({ path: val, history: history });

      expect(file.path).to.equal(val);
      expect(file.history).to.eql(history);
    });

    it('does not mutate history array passed in', function() {
      var val = path.normalize('/test/baz/test.coffee');
      var history = [
        path.normalize('/test/bar/test.coffee'),
        path.normalize('/test/foo/test.coffee'),
      ];
      var historyCopy = Array.prototype.slice.call(history);
      var file = new File({ path: val, history: history });

      var expectedHistory = history.concat(val);

      expect(file.path).to.equal(val);
      expect(file.history).to.eql(expectedHistory);
      expect(history).to.eql(historyCopy);
    });

  });
  describe('defaults', function(){
    it('defaults cwd to process.cwd', function(done) {
      var file = makeFile();
      expect(file.cwd).to.equal(process.cwd());
      done();
    });
    it('defaults base to process.cwd', function(done) {
      var file = makeFile();
      expect(file.base).to.equal(process.cwd());
      done();
    });
    it('defaults base to cwd property', function(done) {
      var cwd = path.normalize('/');
      var file = makeFile({ path: minFileData.path, cwd });
      expect(file.base).to.equal(cwd);
      done();
    });
    it('defaults history to the path entry', function(done) {
      var file = makeFile();
      expect(file.history).to.eql([minFileData.path]);
      done();
    });
    it('defaults stat to null', function(done) {
      var file = makeFile();
      expect(file.stat).to.not.exist;
      expect(file.stat).to.equal(null);
      done();
    });
    it('defaults contents to null', function(done) {
      var file = makeFile();
      expect(file.contents).to.not.exist;
      expect(file.contents).to.equal(null);
      done();
    });
  })
  // describe('.clone()', function () {
  //   it(`clones a file by deferring to the Vinyl 'clone' method`, function () {
  //     const spy = sinon.spy(Vinyl.prototype, 'clone');
  //     const file = makeFile();
  //     const clonedFile = file.clone();
  //     expect(spy.calledOnce).to.be.true;
  //     expect(clonedFile).to.eql(file);
  //     expect(clonedFile).to.not.equal(file);
  //   });
  //   it('retains all the methods of the File class', function () {
  //     const file = makeFile();
  //     const clonedFile = file.clone();
  //     expect(clonedFile instanceof File).to.be.true;
  //     expect(clonedFile.toJSON).to.be.a('function');
  //   });
  // });
  // describe('.toJSON()', function () {
  //   it(`provides a simple 'JSON.stringify'-able representation of the file`, function () {
  //     const file = makeFile();
  //     const jsonedFile = file.toJSON();
  //     expect(jsonedFile).to.be.an('object');
  //     expect(jsonedFile).to.eql({
  //       cwd: '/',
  //       relative: 'file.js',
  //       path: '/test/file.js',
  //       extname: '.js',
  //       base: '/test',
  //       basename: 'file.js',
  //       contents: 'var x = 123',
  //       dirname: '/test',
  //       stem: 'file',
  //       stat: null,
  //       history: ['/test/file.js']
  //     });
  //   });
  //   it(`does not output 'hidden' (underscore-prefixed) properties`, function () {
  //     const file = makeFile({_hidden: 'value', path: '/test/file.js'});
  //     const jsonedFile = file.toJSON();
  //     expect(jsonedFile._hidden).to.not.exist;
  //   });
  //   it(`does not output fs.Stats properties`, function () {
  //     const file = makeFile({customStats: stat, path: '/test/file.js'});
  //     const jsonedFile = file.toJSON();
  //     expect(jsonedFile.customStats).to.not.exist;
  //   });
  //
  //   it(`converts Buffers to their String representation`, function () {
  //     const fileData = {path: '/test/file.js', contents: Buffer.from('this is a tést')};
  //     const entity = makeFile(fileData);
  //     const jsonEntity = entity.toJSON();
  //     expect(jsonEntity.contents).to.equal('this is a tést');
  //   });
  // });
  // describe('.toString()', function () {
  //   describe('outputs a String representation of the File if it', function () {
  //     it('has Buffer contents', function () {
  //       const file = makeFile();
  //       expect(file.toString()).to.equal(fileContents);
  //     });
  //     it('has empty contents', function () {
  //       const file = makeFile({path: 'foo.js'});
  //       expect(file.toString()).to.equal('');
  //     });
  //   });
  // });
  describe('.isFile()', function () {
    it(`returns true if argument is of type 'File'`, function () {
      const file = makeFile();
      const isFile = File.isFile(file);
      expect(isFile).to.be.true;
    });
    it(`returns false if argument is not of type 'File'`, function () {
      const isFile = File.isFile({});
      expect(isFile).to.be.false;
    });
    it(`returns false for null`, function () {
      const isFile = File.isFile(null);
      expect(isFile).to.be.false;
    });
  });
  // describe('.from()', function () {
  //   it(`creates a new instance of a File`, function () {
  //     const fileFrom = File.from(baseFileData);
  //     const file = makeFile();
  //     expect(fileFrom instanceof File).to.be.true;
  //     expect(file).to.eql(fileFrom);
  //   });
  // });
  // describe('.fromPath()', function () {
  //   it(`creates a new instance of a File from a string 'path' parameter`, async function () {
  //     const file = await File.fromPath(path.join(__dirname, 'file.js'));
  //     expect(file instanceof File).to.be.true;
  //   });
  // });
});
