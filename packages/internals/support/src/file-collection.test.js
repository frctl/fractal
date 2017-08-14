/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../test/helpers');
const File = require('./file');
const FileCollection = require('./file-collection');

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

describe('FileCollection', function () {
  describe('constructor', function () {
    it('returns a new instance with correctly inherited properties', function () {
      const collection = new FileCollection();
      expect(collection).to.exist;
      expect(FileCollection.isCollection(collection)).to.equal(true);
      expect(collection.length).to.equal(0);
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
});
