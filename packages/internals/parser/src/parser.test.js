/* eslint handle-callback-err: off, no-unused-expressions: off */
const {join} = require('path');
const mockFs = require('mock-fs');
const {EventEmitter2} = require('eventemitter2');
const {expect, sinon} = require('../../../../test/helpers');
const {filesToComponentsTransform} = require('../test/helpers');
const Parser = require('./parser');
const fileTransform = require('./transform/file-transform')();

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
    it('returns a copy of the original', function () {
      const originalSources = ['/src/components', '/src/components2/', 'lib/from/components'];
      expect(makeParser(originalSources).sources).to.not.equal(originalSources);
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
        src: '/src/components/**/*'
      });
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
        src: join(cwd, 'lib/from/components/**/*')
      });
    });
    it('converts a single string file path to a srcInfo object and adds it', function () {
      const parser = makeParser();
      parser.addSource('/src/components/index.js');
      expect(parser.sources.length).to.equal(1);
      expect(parser.sources[0]).to.eql({
        base: '/src/components',
        glob: '',
        isGlob: false,
        src: '/src/components/index.js'
      });
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
        src: join(cwd, 'lib/from/components/index.js')
      });
    });
  });

  describe('.addTransform()', function () {
    it('adds a transform definition to the parser\'s pipeline instance', function () {
      const parser = makeParser();
      parser.addTransform(fileTransform);
      expect(parser.pipeline.transforms.length).to.equal(1);
    });
  });
  describe('.getTransform()', function () {
    it('retrieves a transform definition from the parser\'s pipeline instance', function () {
      const parser = makeParser();
      parser.addTransform(fileTransform);
      expect(parser.getTransform('files')).to.be.a('Transform').with.property('name').that.equals('files');
    });
    it(`returns 'undefined' if a transform cannot be found for a given name`, function () {
      const parser = makeParser();
      expect(parser.getTransform('files')).to.be.undefined;
    });
  });

  describe('.addPluginToTransform()', function () {
    it('adds a plugin object definition to a named transform', function () {
      const parser = makeParser();
      parser.addTransform(fileTransform);
      const transform = parser.getTransform('files');
      expect(transform).to.be.a('Transform');
      expect(transform.plugins).to.be.a('PluginStore');
      expect(transform.plugins.items.length).to.equal(0);
      parser.addPluginToTransform('files', {
        name: 'files-plugin',
        handler: i => i
      });
      expect(transform.plugins.items.length).to.equal(1);
    });
    it('throws an error if an undefined transform is named', function () {
      const parser = makeParser();
      expect(() => {
        parser.addPluginToTransform('files', {
          name: 'files-plugin',
          handler: i => i
        });
      }).to.throw(Error, '[invalid-transform-name]');
    });
  });

  describe('.run()', function () {
    before(function () {
      mockFs({
        'path/to/fake/@a-component': {
          'some-file.txt': 'file content here',
          'empty-dir': { /** empty directory */ }
        },
        'path/to/fake/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
        'path/to/fake/other/different/@b-component': {
          'other-file.txt': 'file content here',
          'other-dir': { /** empty directory */ }
        }
      });
    });

    after(function () {
      mockFs.restore();
    });

    it('parses a set of files', async function () {
      const parser = makeParser({
        src: ['path/to/fake/**']
      });
      const result = await parser.run();
      expect(result).to.be.an('object')
        .with.a.property('collections')
        .that.eqls({});
    });

    it('emits events when an emitter is supplied', async function () {
      const parser = makeParser({
        src: ['path/to/fake/**']
      });
      const emitter = new EventEmitter2();
      const spy = sinon.spy(emitter, 'emit');

      await parser.run({}, emitter);
      expect(spy.args[0][0]).to.equal('run.start');
      expect(spy.args[spy.args.length - 1][0]).to.equal('run.complete');
    });

    it('runs all transforms and their associated plugins via its pipeline', async function () {
      const parser = makeParser({
        src: ['path/to/fake/**'],
        transforms: [fileTransform, filesToComponentsTransform]
      });
      const result = await parser.run();
      expect(result).to.be.an('object')
        .with.a.property('collections')
        .with.a.property('files-to-comps')
        .that.is.a('ComponentCollection');
      expect(result.collections['files-to-comps'].items.length).to.equal(2);
    });
  });
});
