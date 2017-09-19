const {extname} = require('path');
const {File} = require('@frctl/support');
const {expect, sinon} = require('../../../../test/helpers');
const Adapter = require('./adapter');

const validAdapter = {
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

describe('Adapter', function () {
  describe('constructor()', function () {
    it('throws an error on invalid props', function () {
      expect(() => new Adapter({invalid: 'adapter'})).to.throw(TypeError, '[adapter-invalid]');
      expect(() => new Adapter(validAdapter)).to.not.throw();
    });
  });

  describe('.match()', function () {
    it('tests if the file provided can be handled by the adapter', function () {
      ['.fjk', ['.fjk'], (path => extname(path) === '.fjk')].forEach(match => {
        const adapter = new Adapter(Object.assign({}, validAdapter, {match}));
        expect(adapter.match(funjucksFile.path)).to.equal(true);
        expect(adapter.match(otherFile.path)).to.equal(false);
      });
    });

    it('throws an error if the file argument is not a path', function () {
      const adapter = new Adapter(validAdapter);
      expect(() => adapter.match(funjucksFile)).to.throw(TypeError, '[path-invalid]');
    });
  });

  describe('.render()', function () {
    it('calls the adapter props render method and returns a promise of the result', async function () {
      const renderSpy = sinon.spy(() => 'foobar');
      const adapter = new Adapter({
        name: 'foo',
        match: '.fjk',
        render: renderSpy
      });
      const result = await adapter.render(funjucksFile.contents.toString());
      expect(renderSpy.called).to.equal(true);
      expect(result).to.equal('foobar');
      return result;
    });

    it('rejects if the tpl argument is not a string', function () {
      const adapter = new Adapter(validAdapter);
      return expect(adapter.render({foo: 'bar'})).to.be.rejectedWith(TypeError, '[tpl-invalid]');
    });
  });
});
