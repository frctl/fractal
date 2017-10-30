/* eslint no-unused-expressions: "off" */
const MemoryFileSystem = require('memory-fs');
const {expect} = require('../../../../../test/helpers');
const FileSystemReader = require('./fs-file-reader');

describe('Read Files', function () {
  describe('constructor', function () {
    it(`creates a new FileSystemReader with a readFiles method`, function () {
      const reader = new FileSystemReader();
      expect(reader).to.exist;
      expect(reader.readFiles).to.be.a('function');
    });
    it('reads the files correctly', function (done) {
      const fs = new MemoryFileSystem();
      fs.mkdirpSync('/a/test/dir');
      fs.writeFileSync('/a/test/dir/file1.txt', 'Hello World 1');
      fs.writeFileSync('/a/test/dir/file2.txt', 'Hello World 2');
      const reader = new FileSystemReader(fs);
      const contentlist = [];
      reader.readFiles('/a/',
        function (err, content, filename, next) {
          if (err) {
            throw err;
          }
          contentlist.push(content);
          next();
        },
        function (err, files) {
          if (err) {
            throw err;
          }
          expect(files).to.eql(['/a/test/dir/file1.txt', '/a/test/dir/file2.txt']);
          expect(contentlist).to.eql(['Hello World 1', 'Hello World 2']);
          done();
        });
    });
  });
});
