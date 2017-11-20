/* eslint no-unused-expressions: "off" */

const MemoryFS = require('memory-fs');
const slash = require('slash');
const {expect, sinon} = require('../../../../../test/helpers');
const File = require('../entities/file');
const FileCollection = require('./file-collection');

const fsReadMethods = [
  'existsSync',
  'statSync',
  'readFileSync',
  'readdirSync',
  'readlinkSync',
  'stat',
  'readdir',
  'readlink',
  'readFile',
  'exists'
];

let items = [{
  cwd: '/',
  path: '/mice/mickey.js',
  contents: new Buffer('Mickey Mouse')
},
{
  cwd: '/',
  path: '/mice/jerry.js',
  contents: new Buffer('Jerry')
},
{
  cwd: '/',
  path: '/dogs/pluto.hbs',
  contents: new Buffer('Pluto')
},
{
  cwd: '/',
  path: '/dogs/odie.js',
  contents: new Buffer('Odie')
}
];

const fileContents = 'var x = 123';
const baseFileData = {
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer(fileContents)
};
const makeFile = input => new File(input || baseFileData);
items = items.map(makeFile);

const makeCollection = input => new FileCollection(input || items.slice(0));
const makeCollectionFrom = input => FileCollection.from(input || items.slice(0));

describe('FileCollection', function () {
  describe('constructor', function () {
    it('returns a new instance with correctly inherited properties', function () {
      const collection = new FileCollection();
      expect(collection).to.exist;
      expect(FileCollection.isCollection(collection)).to.equal(true);
      expect(collection.length).to.equal(0);
    });
  });
  describe('.from()', function () {
    it('successfully creates a FileCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom({single: 'object'})).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom({path: 'valid-file-object-definition/'})).to.not.throw();
      expect(() => makeCollectionFrom(new File({path: 'valid-file-object-definition/'}))).to.not.throw();
      expect(() => makeCollectionFrom([File.from({single: 'object'}), File.from({another: 'object'})])).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom([File.from({path: 'object'}), File.from({path: 'object'})])).to.not.throw();
    });
  });

  describe('.find()', function () {
    it(`can be called with a single string argument to find by 'relative' path`, function () {
      const collection = makeCollection();
      expect(collection.find('dogs/odie.js')).to.equal(items[3]);
    });
  });

  describe(`.filter()`, function () {
    it('returns a FileCollection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.filter('type', 'dog');
      expect(newCollection instanceof FileCollection).to.equal(true);
    });
    it('filters by path if a single string argument is supplied', function () {
      const collection = makeCollection();
      const spy = sinon.spy(collection, 'filterByPath');
      const newCollection = collection.filter('dogs/*');
      expect(spy.called).to.equal(true);
      expect(newCollection.count()).to.equal(2);
    });
    it('filters by path if a single array argument is supplied', function () {
      const collection = makeCollection();
      const spy = sinon.spy(collection, 'filterByPath');
      const newCollection = collection.filter(['**/*', '!**/*.js']);
      expect(spy.called).to.equal(true);
      expect(newCollection.count()).to.equal(1);
    });
    it(`defers to its superclass for all other 'filter' arguments`, function () {
      const collection = makeCollection();
      expect(collection.filter('path', '/dogs/odie.js').count()).to.equal(1);
    });
  });

  describe(`.reject()`, function () {
    it('reject by path if a single string argument is supplied', function () {
      const collection = makeCollection();
      const spy = sinon.spy(collection, 'rejectByPath');
      const newCollection = collection.rejectByPath('dogs/*');
      expect(spy.called).to.equal(true);
      expect(newCollection.count()).to.equal(2);
    });
    it('reject by path if a single array argument is supplied', function () {
      const collection = makeCollection();
      const spy = sinon.spy(collection, 'rejectByPath');
      const newCollection = collection.rejectByPath(['**/*', '!**/*.js']);
      expect(spy.called).to.equal(true);
      expect(newCollection.count()).to.equal(3);
    });
    it(`defers to its superclass for all other 'reject' arguments`, function () {
      const collection = makeCollection();
      expect(collection.reject('path', '/dogs/odie.js').count()).to.equal(3);
    });
  });

  describe(`.filterByPath()`, function () {
    it('returns a collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.filterByPath('*');
      expect(FileCollection.isCollection(newCollection));
      expect(newCollection instanceof FileCollection).to.equal(true);
    });

    it(`filters based on a glob string argument for the 'component/path'`, function () {
      const collection = makeCollection();
      expect(collection.filterByPath('dogs/*').count()).to.equal(2);
      expect(collection.filterByPath('**/*.js').count()).to.equal(3);
    });
  });

  describe(`.rejectByPath()`, function () {
    it('returns a collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.rejectByPath('*');
      expect(FileCollection.isCollection(newCollection));
      expect(newCollection instanceof FileCollection).to.equal(true);
    });

    it(`rejects based on a glob string argument for the 'component/path'`, function () {
      const collection = makeCollection();
      expect(collection.rejectByPath('mice/*').count()).to.equal(2);
      expect(collection.rejectByPath('**/*.js').count()).to.equal(1);
    });
  });

  describe(`.toJSON()`, function () {
    it(`calls to the 'toJSON' method of each item in the collection`, function () {
      const collection = makeCollection();
      expect(collection.toJSON()).to.eql(items.map(item => item.toJSON()));
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollection();
      expect(collection[Symbol.toStringTag]).to.equal('FileCollection');
    });
  });

  describe(`.toMemoryFS()`, function () {
    it('returns a MemoryFS instance', function () {
      const collection = makeCollection();
      const memFs = collection.toMemoryFS();
      expect(memFs instanceof MemoryFS).to.equal(true);
    });
    it('adds all files to the MemoryFS instance', function () {
      const collection = makeCollection();
      const memFs = collection.toMemoryFS();
      expect(memFs.readFileSync(slash(items[0].path)).toString()).to.equal(items[0].contents.toString());
    });
    it('throws an error if the MemoryFS instance cannot be created', function () {
      const dodgyFile = items[0].clone();
      dodgyFile.path = '~';
      sinon.stub(dodgyFile, 'path').get(() => '~');
      sinon.stub(dodgyFile, 'clone').callsFake(() => dodgyFile);
      const collection = makeCollection([dodgyFile]);
      expect(() => collection.toMemoryFS()).to.throw('[memfs-error]');
    });
  });

  describe(`.fromMemoryFS`, function () {
    it('converts a memory-fs instance to a FileCollection');
  });

  describe('MemoryFS proxing', function () {
    it(`adds MemoryFS 'read' methods onto the main collection instance`, function () {
      const collection = makeCollection();
      expect(collection.readFileSync(items[0].path).toString()).to.eql(items[0].contents.toString());
      expect(collection.existsSync(items[0].path)).to.eql(true);
      for (const method of fsReadMethods) {
        expect(collection[method]).to.be.a('function');
      }
    });
  });
});
