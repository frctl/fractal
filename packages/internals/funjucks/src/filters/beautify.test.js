/* eslint max-nested-callbacks: off, handle-callback-err: off */

const Vinyl = require('vinyl');
const beautify = require('js-beautify');
const {expect, sinon} = require('../../../../../test/helpers');
const factory = require('./beautify');

describe('beautify', function () {
  it('exports a function', function () {
    expect(factory).to.be.a('function');
  });

  it('returns an object with the expected properties', function () {
    const filter = factory();
    expect(filter.name).to.equal('beautify');
    expect(filter.async).to.equal(true);
    expect(typeof filter.filter).to.equal('function');
  });

  describe('.filter()', function () {
    it('beautifies strings', function (done) {
      const filter = factory();
      filter.filter('<span>\n\ntest</div>', function (err, result) {
        expect(result).to.be.a('string');
        expect(err).to.equal(null);
        done();
      });
    });

    it('beautifies the contents of Vinyl files', function (done) {
      const filter = factory();
      const file = new Vinyl({
        contents: Buffer.from('<div>test</div>')
      });
      filter.filter(file, function (vinylErr, vinylResult) {
        expect(vinylErr).to.equal(null);

        filter.filter(file.contents.toString(), function (stringErr, stringResult) {
          expect(stringErr).to.equal(null);
          expect(vinylResult).to.equal(stringResult);
          done();
        });
      });
    });

    it('can be passed a Promise that resolved to a highlightable entity', function (done) {
      const filter = factory();
      filter.filter(Promise.resolve('<span>\ntest</div>'), function (err, result) {
        expect(result).to.be.a('string');
        expect(err).to.equal(null);
        done();
      });
    });

    it('calls done with the error if a Promise is supplied that rejects', function (done) {
      const filter = factory();
      filter.filter(Promise.reject('oops'), function (err, result) {
        expect(err).to.equal('oops');
        done();
      });
    });

    it('supports specifying a language', function (done) {
      const filter = factory();
      const spy = sinon.spy(beautify, 'js');
      filter.filter('{foo: "bar"}', 'js', function (err, result) {
        expect(spy.called).to.equal(true);
        done();
      });
    });

    it('defaults to HTML if no language is specified', function (done) {
      const filter = factory();
      const spy = sinon.spy(beautify, 'html');
      filter.filter('<span>\ntest</div>', function (err, result) {
        expect(spy.called).to.equal(true);
        done();
      });
    });
  });
});
