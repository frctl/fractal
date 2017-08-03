const {expect} = require('../../../../../test/helpers');
const factory = require('./stringify');

describe('await', function () {
  it('exports a function', function () {
    expect(factory).to.be.a('function');
  });

  it('returns an object with the expected properties', function () {
    const filter = factory();
    expect(filter.name).to.equal('stringify');
    expect(filter.async).to.equal(false);
    expect(typeof filter.filter).to.equal('function');
  });

  describe('.filter()', function () {
    it('stringifies objects', function () {
      const filter = factory();
      const obj = {prop: 'value'};
      expect(filter.filter(obj)).to.equal(JSON.stringify(obj, null, 2));
    });
    it('returns strings untouched', function () {
      const filter = factory();
      expect(filter.filter('foo')).to.equal('foo');
    });
  });
});
