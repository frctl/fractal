/* eslint no-unused-expressions: "off" */
const fs = require('fs');
const path = require('path');
const Vinyl = require('vinyl');
const {omit} = require('lodash');
const {normalizePath, hash} = require('@frctl/utils');
const {expect} = require('../../../../../test/helpers');
const File = require('./file');

const isWin = (process.platform === 'win32');

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
const makeFile = input => new File(input || Object.assign({}, minFileData));

describe('File', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const file = makeFile();
      expect(file).to.exist;
      expect(file).to.be.a('File');
    });
    it('throws an error if invalid props provided', function () {
      expect(() => makeFile({})).to.throw(TypeError, '[properties-invalid]');
    });

    it('sets base', function () {
      const val = path.normalize('/');
      const file = makeFile({
        path: minFileData.path,
        base: val
      });
      expect(file.base).to.equal(val);
    });

    it('sets cwd', function () {
      const val = path.normalize('/');
      const file = makeFile({
        path: baseFileData.path,
        cwd: val
      });
      expect(file.cwd).to.equal(val);
    });

    it('sets path', function () {
      const val = path.normalize('/test.coffee');
      const file = makeFile({
        path: val
      });
      expect(file.path).to.equal(val);
    });

    it('sets stat', function () {
      const val = {};
      const file = makeFile({
        path: minFileData.path,
        stat: val
      });
      expect(file.stat).to.eql(val);
    });

    it('sets contents', function () {
      const val = new Buffer('test');
      const file = makeFile({
        path: minFileData.path,
        contents: val
      });
      expect(file.contents).to.eql(val);
    });

    it('sets custom properties', function () {
      const sourceMap = {
        foo: 'bar'
      };
      const id = '/comp/e43';
      const file = makeFile({
        path: minFileData.path,
        sourceMap: sourceMap,
        id: id
      });
      expect(file.sourceMap).to.eql(sourceMap);
      expect(file.id).to.equal(id);
    });

    it('normalizes path', function () {
      const val = '/test/foo/../test.coffee';
      const expected = path.normalize(val);
      const file = makeFile({
        path: val
      });
      expect(file.path).to.equal(expected);
    });

    it('normalizes and removes trailing separator from path', function () {
      const val = '/test/foo/../foo/';
      const expected = path.normalize(val.slice(0, -1));
      const file = makeFile({
        path: val
      });
      expect(file.path).to.eql(expected);
    });
  });
  describe('defaults', function () {
    it('defaults cwd to process.cwd', function () {
      const file = makeFile();
      expect(file.cwd).to.equal(process.cwd());
    });
    it('defaults base to process.cwd', function () {
      const file = makeFile();
      expect(file.base).to.equal(process.cwd());
    });
    it('defaults base to cwd property', function () {
      const cwd = path.normalize('/');
      const file = makeFile({
        path: minFileData.path,
        cwd
      });
      expect(file.base).to.equal(cwd);
    });
    it('defaults stat to null', function () {
      const file = makeFile();
      expect(file.stat).to.not.exist;
      expect(file.stat).to.equal(null);
    });
    it('defaults contents to null', function () {
      const file = makeFile();
      expect(file.contents).to.not.exist;
      expect(file.contents).to.equal(null);
    });
  });

  describe('.contents get/set', function () {
    it('returns/sets contents', function () {
      const val = new Buffer('test');
      const file = makeFile();
      file.contents = val;
      expect(file.contents).to.eql(val);
    });
    it('sets a Buffer', function () {
      const val = new Buffer('test');
      const file = makeFile();
      file.contents = val;
      expect(file.contents).to.eql(val);
    });
    it('sets null', function () {
      const val = null;
      const file = makeFile();
      file.contents = val;
      expect(file.contents).to.equal(null);
    });
  });

  describe('.cwd get', function () {
    it('returns cwd', function () {
      const val = '/test';
      const file = makeFile({
        path: 'test/file.js',
        cwd: '/test/'
      });
      expect(file.cwd).to.equal(val);
    });
    it('normalizes and removes trailing separator on init', function () {
      const val = '/test/foo/../foo/';
      const expected = normalizePath(val.slice(0, -1));
      let file = makeFile({
        path: 'test/foo/file.js',
        cwd: val
      });

      expect(file.cwd).to.equal(expected);

      const val2 = '\\test\\foo\\..\\foo\\';
      file = makeFile({
        path: 'test/foo/file.js',
        cwd: val2
      });
      const expected2 = normalizePath(isWin ? val2.slice(0, -1) : val2);

      expect(file.cwd).to.equal(expected2);
    });
    it('throws an error on set', function () {
      const val = '/test';
      const file = makeFile({
        path: 'test/file.js',
        cwd: '/test/'
      });
      expect(file.cwd).to.equal(val);
      expect(() => {
        file.cwd = '/foo';
      }).to.throw(Error, '[invalid-set-cwd]');
      expect(file.cwd).to.equal(val);
    });
    it('throws on init with invalid values', function () {
      const invalidValues = [
        '',
        true,
        false,
        0,
        Infinity,
        NaN,
        {},
        []
      ];

      invalidValues.forEach(function (val, index) {
        function invalid() {
          makeFile({
            path: 'test/foo/file.js',
            cwd: val
          });
        }
        expect(invalid).to.throw(TypeError, '[properties-invalid]');
      });
    });
  });

  describe('.base get/set', function () {
    it('proxies cwd when omitted', function () {
      const file = makeFile({
        path: '/test',
        cwd: '/test'
      });
      expect(file.base).to.equal(file.cwd);
    });

    it('proxies cwd when same', function () {
      const file = makeFile({
        path: '/test',
        cwd: '/test',
        base: '/test'
      });
      expect(file.base).to.equal(file.cwd);

      const file2 = makeFile({
        path: '/test',
        cwd: '/test'
      });
      file2.base = '/test/';
      expect(file2.base).to.equal(file2.cwd);
    });

    it('proxies to cwd when set to same value', function () {
      const file = makeFile({
        path: '/test',
        cwd: '/foo',
        base: '/bar'
      });
      expect(file.base).to.not.equal(file.cwd);
      file.base = file.cwd;
      expect(file.base).to.equal(file.cwd);
    });

    it('proxies to cwd when null or undefined', function () {
      const file = makeFile({
        path: '/test',
        cwd: '/foo',
        base: '/bar'
      });
      expect(file.base).to.not.equal(file.cwd);
      file.base = null;
      expect(file.base).to.equal(file.cwd);
      file.base = '/bar/';
      expect(file.base).to.not.equal(file.cwd);
      file.base = undefined;
      expect(file.base).to.equal(file.cwd);
    });

    it('returns base', function () {
      const val = '/test/';
      const file = makeFile();
      file.base = val;
      expect(file.base).to.equal(normalizePath(val));
    });

    it('sets base', function () {
      const val = '/test/foo';
      const file = makeFile();
      file.base = val;
      expect(file.base).to.equal(path.normalize(val));
    });

    it('normalizes and removes trailing separator on set', function () {
      const val = '/test/foo/../foo/';
      const expected = normalizePath(val.slice(0, -1));
      const file = makeFile();

      file.base = val;

      expect(file.base).to.equal(expected);

      const val2 = '\\test\\foo\\..\\foo\\';
      const expected2 = normalizePath(isWin ? val2.slice(0, -1) : val2);

      file.base = val2;

      expect(file.base).to.equal(expected2);
    });

    it('throws on set with invalid values', function () {
      const invalidValues = [
        true,
        false,
        1,
        0,
        Infinity,
        NaN,
        '',
        {},
        []
      ];
      const file = makeFile();

      invalidValues.forEach(function (val) {
        function invalid() {
          file.base = val;
        }
        expect(invalid).to.throw(TypeError, '[base-invalid]');
      });
    });
  });

  describe('.relative get/set', function () {
    it('throws on set', function () {
      const file = makeFile();

      function invalid() {
        file.relative = 'test';
      }

      expect(invalid).to.throw(Error, '[invalid-set-relative]');
    });

    it('returns a relative path from base', function () {
      const file = makeFile({
        base: '/test/',
        path: '/test/test.coffee'
      });

      expect(file.relative).to.equal('test.coffee');
    });

    it('returns a relative path from cwd', function () {
      const file = makeFile({
        cwd: '/',
        path: '/test/test.coffee'
      });

      expect(file.relative).to.equal(path.normalize('test/test.coffee'));
    });

    it('does not append separator when directory', function () {
      const file = makeFile({
        base: '/test',
        path: '/test/foo/bar',
        stat: {
          isDirectory: function () {
            return true;
          }
        }
      });

      expect(file.relative).to.equal(path.normalize('foo/bar'));
    });

    it('does not append separator when symlink', function () {
      const file = makeFile({
        base: '/test',
        path: '/test/foo/bar',
        stat: {
          isSymbolicLink: function () {
            return true;
          }
        }
      });

      expect(file.relative).to.equal(path.normalize('foo/bar'));
    });

    it('does not append separator when directory & symlink', function () {
      const file = makeFile({
        base: '/test',
        path: '/test/foo/bar',
        stat: {
          isDirectory: function () {
            return true;
          },
          isSymbolicLink: function () {
            return true;
          }
        }
      });

      expect(file.relative).to.equal(path.normalize('foo/bar'));
    });
  });

  describe('.basename get/set', function () {
    it('returns the basename of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      expect(file.basename).to.equal('test.coffee');
    });

    it('does not append trailing separator when directory', function () {
      const file = makeFile({
        path: '/test/foo',
        stat: {
          isDirectory: function () {
            return true;
          }
        }
      });

      expect(file.basename).to.equal('foo');
    });

    it('does not append trailing separator when symlink', function () {
      const file = makeFile({
        path: '/test/foo',
        stat: {
          isSymbolicLink: function () {
            return true;
          }
        }
      });

      expect(file.basename).to.equal('foo');
    });

    it('does not append trailing separator when directory & symlink', function () {
      const file = makeFile({
        path: '/test/foo',
        stat: {
          isDirectory: function () {
            return true;
          },
          isSymbolicLink: function () {
            return true;
          }
        }
      });

      expect(file.basename).to.equal('foo');
    });

    it('removes trailing separator', function () {
      const file = makeFile({
        path: '/test/foo/'
      });

      expect(file.basename).to.equal('foo');
    });

    it('removes trailing separator when directory', function () {
      const file = makeFile({
        path: '/test/foo/',
        stat: {
          isDirectory: function () {
            return true;
          }
        }
      });

      expect(file.basename).to.equal('foo');
    });

    it('removes trailing separator when symlink', function () {
      const file = makeFile({
        path: '/test/foo/',
        stat: {
          isSymbolicLink: function () {
            return true;
          }
        }
      });

      expect(file.basename).to.equal('foo');
    });

    it('removes trailing separator when directory & symlink', function () {
      const file = makeFile({
        path: '/test/foo/',
        stat: {
          isDirectory: function () {
            return true;
          },
          isSymbolicLink: function () {
            return true;
          }
        }
      });

      expect(file.basename).to.equal('foo');
    });

    it('replaces the basename of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      file.basename = 'foo.png';
      expect(file.path).to.equal(path.normalize('/test/foo.png'));
    });
  });

  describe('.dirname get/set', function () {
    it('returns the dirname without trailing separator', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test',
        path: '/test/test.coffee'
      });

      expect(file.dirname).to.equal(path.normalize('/test'));
    });

    it('replaces the dirname of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      file.dirname = '/test/foo';
      expect(file.path).to.equal(path.normalize('/test/foo/test.coffee'));
    });
  });

  describe('.extname get/set', function () {
    it('returns the extname of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      expect(file.extname).to.equal('.coffee');
    });

    it('replaces the extname of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      file.extname = '.png';
      expect(file.path).to.equal(path.normalize('/test/test.png'));
      file.set('extname', '.jpg');
      expect(file.get('path')).to.equal(path.normalize('/test/test.jpg'));
    });
  });

  describe('.stem get/set', function () {
    it('returns the stem of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      expect(file.stem).to.equal('test');
      expect(file.get('stem')).to.equal('test');
    });

    it('replaces the stem of the path', function () {
      const file = makeFile({
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee'
      });

      file.stem = 'foo';
      expect(file.path).to.equal(path.normalize('/test/foo.coffee'));

      file.set('stem', 'bar');
      expect(file.get('path')).to.equal(path.normalize('/test/bar.coffee'));
    });
  });

  describe('.path get/set', function () {
    it('throws on set with empty-string path', function () {
      const file = makeFile();

      function invalid() {
        file.path = '';
      }

      expect(invalid).to.throw(TypeError, '[path-invalid]');
    });

    it('throws on set with null path', function () {
      const file = makeFile();

      function invalid() {
        file.path = null;
      }

      expect(invalid).to.throw(TypeError, '[path-invalid]');
    });

    it('normalizes the path upon set', function () {
      const val = '/test/foo/../test.coffee';
      const expected = path.normalize(val);
      const file = makeFile({
        path: val
      });

      file.path = val;

      expect(file.path).to.equal(expected);
    });

    it('removes the trailing separator upon set', function () {
      const file = makeFile();
      file.path = '/test/';

      expect(file.path).to.equal(path.normalize('/test'));
    });

    it('removes the trailing separator upon set when directory', function () {
      const file = makeFile({
        path: minFileData.path,
        stat: {
          isDirectory: function () {
            return true;
          }
        }
      });
      file.path = '/test/';

      expect(file.path).to.equal(path.normalize('/test'));
    });

    it('removes the trailing separator upon set when symlink', function () {
      const file = makeFile({
        path: minFileData.path,
        stat: {
          isSymbolicLink: function () {
            return true;
          }
        }
      });
      file.path = '/test/';

      expect(file.path).to.equal(path.normalize('/test'));
    });

    it('removes the trailing separator upon set when directory & symlink', function () {
      const file = makeFile({
        path: minFileData.path,
        stat: {
          isDirectory: function () {
            return true;
          },
          isSymbolicLink: function () {
            return true;
          }
        }
      });
      file.path = '/test/';

      expect(file.path).to.equal(path.normalize('/test'));
    });
  });

  describe('.isDirectory()', function () {
    var fakeStat = {
      isDirectory: function () {
        return true;
      }
    };

    it('returns false when the contents are a Buffer', function () {
      const val = new Buffer('test');
      const file = makeFile({
        path: minFileData.path,
        contents: val,
        stat: fakeStat
      });
      expect(file.isDirectory()).to.equal(false);
    });

    it('returns true when the contents are null & stat.isDirectory is true', function () {
      const file = makeFile({
        path: minFileData.path,
        contents: null,
        stat: fakeStat
      });
      expect(file.isDirectory()).to.equal(true);
    });

    it('returns false when stat exists but does not contain an isDirectory method', function () {
      const file = makeFile({
        path: minFileData.path,
        contents: null,
        stat: {}
      });
      expect(file.isDirectory()).to.equal(false);
    });

    it('returns false when stat does not exist', function () {
      const file = makeFile({
        path: minFileData.path,
        contents: null
      });
      expect(file.isDirectory()).to.equal(false);
    });
  });

  describe('.clone()', function () {
    it('copies all attributes over with Buffer contents', function () {
      const options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: new Buffer('test')
      };
      const file = makeFile(options);
      const file2 = file.clone();

      expect(file2).to.not.equal(file);
      expect(file2.cwd).to.equal(file.cwd);
      expect(file2.base).to.equal(file.base);
      expect(file2.path).to.equal(file.path);
      expect(file2.contents).to.not.equal(file.contents);
      expect(file2.contents.toString('utf8')).to.equal(file.contents.toString('utf8'));
    });

    it('clones Buffer content', function () {
      const options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.js',
        contents: new Buffer('test')
      };
      const file = makeFile(options);

      const copy1 = file.clone();
      expect(copy1.contents).to.eql(file.contents);
      expect(copy1.contents).to.not.equal(file.contents);
    });

    it('copies all attributes over with null contents', function () {
      const options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null
      };
      const file = makeFile(options);
      const file2 = file.clone();

      expect(file2).to.not.equal(file);
      expect(file2.cwd).to.equal(file.cwd);
      expect(file2.base).to.equal(file.base);
      expect(file2.path).to.equal(file.path);
      expect(file2.contents).to.not.exist;
    });

    it('properly clones the `stat` property', function () {
      const options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.js',
        contents: new Buffer('test'),
        stat: fs.statSync(__filename)
      };

      const file = makeFile(options);
      const copy = file.clone();

      expect(copy.stat.isFile()).to.equal(true);
      expect(copy.stat.isDirectory()).to.equal(false);
      expect(file.stat).to.be.an.instanceof(fs.Stats);
      expect(copy.stat).to.be.an.instanceof(fs.Stats);
    });

    it('copies custom properties', function () {
      const options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null,
        custom: {meta: {}}
      };

      const file = makeFile(options);
      const file2 = file.clone();

      expect(file2).to.not.equal(file);
      expect(file2.cwd).to.equal(file.cwd);
      expect(file2.base).to.equal(file.base);
      expect(file2.path).to.equal(file.path);
      expect(file2.custom).to.not.equal(file.custom);
      expect(file2.custom.meta).to.not.equal(file.custom.meta);
      expect(file2.custom).to.eql(file.custom);
    });

    it('supports deep copy of all attributes', function () {
      const options = {
        cwd: '/',
        base: '/test/',
        path: '/test/test.coffee',
        contents: null,
        custom: {meta: {}}
      };

      const file = makeFile(options);

      const file2 = file.clone();
      expect(file2.custom).to.eql(file.custom);
      expect(file2.custom).to.not.equal(file.custom);
      expect(file2.custom.meta).to.eql(file.custom.meta);
      expect(file2.custom.meta).to.not.equal(file.custom.meta);

      const file3 = file.clone();
      expect(file3.custom).to.eql(file.custom);
      expect(file3.custom).to.not.equal(file.custom);
      expect(file3.custom.meta).to.eql(file.custom.meta);
      expect(file3.custom.meta).to.not.equal(file.custom.meta);
    });

    it('supports inheritance', function () {
      class ExtendedFile extends File {}

      const file = new ExtendedFile(minFileData);
      const file2 = file.clone();

      expect(file2).to.not.equal(file);
      expect(file2.constructor).to.eql(ExtendedFile);
      expect(file2).to.be.an.instanceof(ExtendedFile);
      expect(file2).to.be.an.instanceof(File);
      expect(ExtendedFile.prototype.isPrototypeOf(file2)).to.equal(true); // eslint-disable-line no-prototype-builtins
      expect(File.prototype.isPrototypeOf(file2)).to.equal(true); // eslint-disable-line no-prototype-builtins
    });
  });

  describe('.toVinyl()', function () {
    it('returns a Vinyl instance', function () {
      const file = makeFile();
      const vinylFile = file.toVinyl();
      expect(vinylFile).to.be.an.instanceof(Vinyl);
    });
  });

  describe('.toJSON()', function () {
    it(`provides a simple 'JSON.stringify'-able representation of the file`, function () {
      const file = makeFile(baseFileData);
      const jsonedFile = omit(file.toJSON(), ['uuid']);
      expect(jsonedFile).to.be.an('object');
      expect(jsonedFile).to.eql({
        id: hash('/test/file.js'),
        cwd: '/',
        relative: 'file.js',
        path: '/test/file.js',
        extname: '.js',
        base: '/test',
        basename: 'file.js',
        contents: 'var x = 123',
        dirname: '/test',
        stem: 'file',
        stat: null
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
        const file = makeFile(baseFileData);
        expect(file.toString()).to.equal(fileContents);
      });
      it('has empty contents', function () {
        const file = makeFile({path: 'foo.js'});
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
    it(`returns false for null`, function () {
      const isFile = File.isFile(null);
      expect(isFile).to.be.false;
    });
  });
  describe('.from()', function () {
    it(`creates a new instance of a File`, function () {
      const fileFrom = File.from(minFileData);
      const file = makeFile();
      expect(fileFrom instanceof File).to.be.true;
      expect(omit(file.toJSON(), 'uuid')).to.eql(omit(fileFrom.toJSON(), 'uuid'));
    });
  });
  describe('.fromPath()', function () {
    it(`creates a new instance of a File from a string 'path' parameter`, async function () {
      const file = await File.fromPath(path.join(__dirname, 'file.js'));
      expect(file instanceof File).to.be.true;
    });
  });
});
