/* eslint handle-callback-err: off, no-unused-expressions: off */
const {join} = require('path');
const {expect} = require('../../../../test/helpers');
const Parser = require('./parser');

const makeParser = props => {
  return new Parser(props);
};

describe('Parser', function () {
  describe('constructor', function () {
    it('creates a new instance', function () {
      const parser = new Parser();
      expect(parser instanceof Parser).to.be.true;
    });
  });

  describe('.sources', function () {
    it('is a getter', function () {
      expect(makeParser().sources).to.eql([]);
    });
  });

  describe('.addSource()', function () {
    it('converts a single string dir path to a srcInfo object and adds it', function () {
      const parser = makeParser();
      parser.addSource('/src/components');
      expect(parser.sources.length).to.equal(1);
      expect(parser.sources[0]).to.eql({
        base: '/src/components',
        glob: '**/*',
        isGlob: true,
        src: '/src/components/**/*'});
    });
    it('converts an array of dir path strings to srcInfo objects and adds then', function () {
      const parser = makeParser();
      const cwd = process.cwd();
      parser.addSource(['/src/components', '/src/components2/', 'lib/from/components']);
      expect(parser.sources.length).to.equal(3);
      expect(parser.sources[2]).to.eql({
        base: join(cwd, 'lib/from/components'),
        glob: '**/*',
        isGlob: true,
        src: join(cwd, 'lib/from/components/**/*')});
    });
    it('converts a single string file path to a srcInfo object and adds it', function () {
      const parser = makeParser();
      parser.addSource('/src/components/index.js');
      expect(parser.sources.length).to.equal(1);
      expect(parser.sources[0]).to.eql({
        base: '/src/components',
        glob: '',
        isGlob: false,
        src: '/src/components/index.js'});
    });
    it('converts an array of file path strings to srcInfo objects and adds then', function () {
      const parser = makeParser();
      const cwd = process.cwd();
      parser.addSource(['/src/components/index.js', '/src/components2/index.js', 'lib/from/components/index.js']);
      expect(parser.sources.length).to.equal(3);
      expect(parser.sources[2]).to.eql({
        base: join(cwd, 'lib/from/components'),
        glob: '',
        isGlob: false,
        src: join(cwd, 'lib/from/components/index.js')});
    });
  });
});
