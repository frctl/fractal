/* eslint no-unused-expressions: "off" */
const proxyquire = require('proxyquire');
const {EventEmitter2} = require('eventemitter2');
const {expect,sinon} = require('../../../../test/helpers');
const FsReader = require('./fs-file-reader');
const MemoryFileSystem = require('memory-fs');

describe.only('Read Files', function() {
  describe('constructor', function() {
    it(`creates a new FsReader with a readFiles method`, function() {
      const reader = new FsReader();
      expect(reader).to.exist;
      expect(reader.readFiles).to.be.a('function');
    });
    it('reads the files correctly', function(done) {
      const fs = new MemoryFileSystem();
      fs.mkdirpSync("/a/test/dir");
      fs.writeFileSync("/a/test/dir/file1.txt", "Hello World 1");
      fs.writeFileSync("/a/test/dir/file2.txt", "Hello World 2");
      const reader = new FsReader(fs);
      const contentlist = [];
      reader.readFiles('/a/',
        function(err, content, filename, next) {
          if (err) throw err;
          console.log(filename);
          contentlist.push(content);
          next();
        },
        function(err, files) {
          if (err) throw err;
          expect(files).to.eql(['/a/test/dir/file1.txt', '/a/test/dir/file2.txt'])
          expect(contentlist).to.eql(['Hello World 1', 'Hello World 2']);
          done();
        });
    });
  });
});
