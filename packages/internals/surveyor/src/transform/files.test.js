/* eslint no-unused-expressions: "off" */
const {FileCollection} = require('@frctl/support');
const {expect} = require('../../../../../test/helpers');
const filesTransform = require('./files');

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

const getFileArray = input => input || items.slice(0);

describe.only('Files Transform', function () {
  describe('factory', function () {
    it('exported as a function', function () {
      expect(filesTransform).to.be.a('function');
    });
    it('returns a valid transform object', function () {
      const transform = filesTransform();
      expect(transform).to.be.an('object');
      expect(transform).to.have.a.property('name').that.is.a('string');
      expect(transform).to.have.a.property('passthru').that.is.a('boolean');
      expect(transform).to.have.a.property('transform').that.is.a('function');
    });
  });
  describe('.transform()', function () {
    it('transforms an array of file-like objects to a FileCollection', function () {
      const fileArray = getFileArray();
      const transform = filesTransform().transform;
      const output = transform(fileArray);
      expect(output instanceof FileCollection).to.be.true;
      expect(output).to.have.property('length').that.equals(4);
    });
  });
});
