const {expect} = require('../../../../../../test/helpers');
const factory = require('./await');

describe('await', function () {
  it('exports a function', function () {
    expect(factory).to.be.a('function');
  });

  it('returns an object with the expected properties', function () {
    const filter = factory();
    expect(filter.name).to.equal('await');
    expect(filter.async).to.equal(true);
    expect(typeof filter.filter).to.equal('function');
  });

  describe('.filter()', function () {
    it('calls the callback with the result if the promise is resolved', function (done) {
      const filter = factory();
      const val = 'foo';
      filter.filter(Promise.resolve(val), function (err, result) {
        expect(result).to.equal(val);
        expect(err).to.equal(null);
        done();
      });
    });

    it('calls the callback with the error if the promise is rejected', function (done) {
      const filter = factory();
      const error = new Error('nope');
      filter.filter(Promise.reject(error), function (err, result) {
        expect(err).to.equal(error);
        done();
      });
    });

    it('works correctly if a non-promise argument is supplied', function (done) {
      const filter = factory();
      filter.filter('foo', function (err, result) {
        expect(result).to.equal('foo');
        expect(err).to.equal(null);
        done();
      });
    });
  });
});
