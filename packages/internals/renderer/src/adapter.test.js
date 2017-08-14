const {File} = require('@frctl/support');
const {expect, validateSchema, sinon} = require('../../../../test/helpers');
const adapterSchema = require('./adapter.schema');
const Adapter = require('./adapter');

const validAdapter = {
  name: 'funjucks',
  match: '.fjk',
  render: function () {
    return Promise.resolve('the rendered string');
  }
};

const funjucksFile = new File({
  path: 'path/to/file.fjk'
});

const otherFile = new File({
  path: 'path/to/file.foo'
});

describe.only('Adapter', function () {
  describe('constructor()', function () {
    it('throws an error on invalid props', function () {
      expect(() => new Adapter({invalid: 'adapter'})).to.throw(TypeError, ['properties-invalid']);
      expect(() => new Adapter(validAdapter)).to.not.throw();
    });
  });

  describe('.match()', function () {
    it('tests if the file provided can be handled by the adapter', function () {
      ['.fjk', ['.fjk'], (file => file.extname === '.fjk')].forEach(match => {
        const adapter = new Adapter(Object.assign({}, validAdapter, {match}));
        expect(adapter.match(funjucksFile)).to.equal(true);
        expect(adapter.match(otherFile)).to.equal(false);
      });
    });

    it('throws an error if the file argument is not a File instance', function () {
      const adapter = new Adapter(validAdapter);
      expect(() => adapter.match('bar')).to.throw(TypeError, '[file-invalid]');
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
      const result = await adapter.render(funjucksFile);
      expect(renderSpy.called).to.equal(true);
      expect(result).to.equal('foobar');
      return result;
    });

    it('rejects if the file argument is not a File instance', function () {
      const adapter = new Adapter(validAdapter);
      return expect(adapter.render('bar')).to.be.rejectedWith(TypeError, '[file-invalid]');
    });
  });
});

describe('Adapter schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(adapterSchema)).to.equal(true);
  });
});
