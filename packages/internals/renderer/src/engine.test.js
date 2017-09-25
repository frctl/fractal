const {extname} = require('path');
const {File} = require('@frctl/support');
const {expect, sinon} = require('../../../../test/helpers');
const Engine = require('./engine');

const validEngine = {
  name: 'funjucks',
  match: '.fjk',
  render: function () {
    return Promise.resolve('the rendered string');
  }
};

const funjucksFile = new File({
  path: 'path/to/file.fjk',
  contents: new Buffer('asdasd')
});

const otherFile = new File({
  path: 'path/to/file.foo'
});

describe('Engine', function () {
  describe('constructor()', function () {
    it('throws an error on invalid props', function () {
      expect(() => new Engine({invalid: 'engine'})).to.throw(TypeError, '[engine-invalid]');
      expect(() => new Engine(validEngine)).to.not.throw();
    });
  });

  describe('.match()', function () {
    it('tests if the file provided can be handled by the engine', function () {
      ['.fjk', ['.fjk'], (path => extname(path) === '.fjk')].forEach(match => {
        const engine = new Engine(Object.assign({}, validEngine, {match}));
        expect(engine.match(funjucksFile.path)).to.equal(true);
        expect(engine.match(otherFile.path)).to.equal(false);
      });
    });

    it('throws an error if the file argument is not a path', function () {
      const engine = new Engine(validEngine);
      expect(() => engine.match(funjucksFile)).to.throw(TypeError, '[path-invalid]');
    });
  });

  describe('.render()', function () {
    it('calls the engine props render method and returns a promise of the result', async function () {
      const renderSpy = sinon.spy(() => 'foobar');
      const engine = new Engine({
        name: 'foo',
        match: '.fjk',
        render: renderSpy
      });
      const result = await engine.render(funjucksFile.contents.toString());
      expect(renderSpy.called).to.equal(true);
      expect(result).to.equal('foobar');
      return result;
    });

    it('rejects if the tpl argument is not a string', function () {
      const engine = new Engine(validEngine);
      return expect(engine.render({foo: 'bar'})).to.be.rejectedWith(TypeError, '[template-invalid]');
    });
  });
});
