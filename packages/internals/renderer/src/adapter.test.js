const {File} = require('@frctl/support');
const {expect, validateSchema} = require('../../../../test/helpers');
const adapterSchema = require('./adapter.schema');
const adapter = require('./adapter');

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

describe('Renderer - adapter', function () {
  it('exports a function', function () {
    expect(adapter).to.be.a('function');
  });

  it('validates adapter schemas', function () {
    expect(() => adapter({invalid: 'adapter'})).to.throw(TypeError, ['properties-invalid']);
    expect(() => adapter(validAdapter)).to.not.throw();
  });

  it('returns an adapter object', function () {
    expect(adapter(validAdapter)).to.be.an('object').with.all.keys(['name', 'match', 'render']);
  });

  it('wraps the match prop to return a file-matching method', function () {
    ['.fjk', ['.fjk'], (file => file.extname === '.fjk')].forEach(match => {
      const test = adapter(Object.assign({}, validAdapter, {match}));
      expect(test.match(funjucksFile)).to.equal(true);
      expect(test.match(otherFile)).to.equal(false);
      expect(() => test.match('bar')).to.throw(TypeError, '[file-invalid]');
    });
  });
});

describe('Renderer - adapter schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(adapterSchema)).to.equal(true);
  });
});
