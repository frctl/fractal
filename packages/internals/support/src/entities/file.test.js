/* eslint no-unused-expressions: "off" */
const fs = require('fs');
const path = require('path');
const Vinyl = require('vinyl');
const {expect, sinon} = require('../../../../../test/helpers');
const File = require('./file');

const fileContents = 'var x = 123';
const stat = fs.statSync('.');
const baseFileData = {
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer(fileContents)
};
const makeFile = input => new File(input || baseFileData);

describe('File', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const file = makeFile();
      expect(file).to.exist;
      expect(file instanceof Vinyl).to.be.true;
    });
  });
  describe('.clone()', function () {
    it(`clones a file by deferring to the Vinyl 'clone' method`, function () {
      const spy = sinon.spy(Vinyl.prototype, 'clone');
      const file = makeFile();
      const clonedFile = file.clone();
      expect(spy.calledOnce).to.be.true;
      expect(clonedFile).to.eql(file);
      expect(clonedFile).to.not.equal(file);
    });
    it('retains all the methods of the File class', function () {
      const file = makeFile();
      const clonedFile = file.clone();
      expect(clonedFile instanceof File).to.be.true;
      expect(clonedFile.toJSON).to.be.a('function');
    });
  });
  describe('.toJSON()', function () {
    it(`provides a simple 'JSON.stringify'-able representation of the file`, function () {
      const file = makeFile();
      const jsonedFile = file.toJSON();
      expect(jsonedFile).to.be.an('object');
      expect(jsonedFile).to.eql({
        cwd: '/',
        relative: 'file.js',
        path: '/test/file.js',
        extname: '.js',
        base: '/test',
        basename: 'file.js',
        contents: 'var x = 123',
        dirname: '/test',
        stem: 'file',
        stat: null,
        history: ['/test/file.js']
      });
    });
    it(`does not output 'hidden' (underscore-prefixed) properties`, function () {
      const file = makeFile({_hidden: 'value', path: '/test/file.js'});
      const jsonedFile = file.toJSON();
      expect(jsonedFile._hidden).to.not.exist;
    });
    it(`does not output fs.Stats properties`, function () {
      const file = makeFile({customStats: stat, path: '/test/file.js'});
      const jsonedFile = file.toJSON();
      expect(jsonedFile.customStats).to.not.exist;
    });

    it(`converts Buffers to their String representation`, function () {
      const fileData = {path: '/test/file.js', contents: Buffer.from('this is a tést')};
      const entity = makeFile(fileData);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity.contents).to.equal('this is a tést');
    });
  });
  describe('.toString()', function () {
    describe('outputs a String representation of the File if it', function () {
      it('has Buffer contents', function () {
        const file = makeFile();
        expect(file.toString()).to.equal(fileContents);
      });
      it('has empty contents', function () {
        const file = makeFile({});
        expect(file.toString()).to.equal('');
      });
    });
  });
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
  });
  describe('.from()', function () {
    it(`creates a new instance of a File`, function () {
      const fileFrom = File.from(baseFileData);
      const file = makeFile();
      expect(fileFrom instanceof File).to.be.true;
      expect(file).to.eql(fileFrom);
    });
  });
  describe('.fromPath()', function () {
    it(`creates a new instance of a File from a string 'path' parameter`, async function () {
      const file = await File.fromPath(path.join(__dirname, 'file.js'));
      expect(file instanceof File).to.be.true;
    });
  });
});
