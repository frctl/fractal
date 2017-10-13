/* eslint max-nested-callbacks: off, handle-callback-err: off */

const Vinyl = require('vinyl');
const highlight = require('highlight.js');
const {expect, sinon} = require('../../../../../test/helpers');
const factory = require('./highlight');

describe('highlight', function () {
  it('exports a function', function () {
    expect(factory).to.be.a('function');
  });

  it('returns an object with the expected properties', function () {
    const filter = factory();
    expect(filter.name).to.equal('highlight');
    expect(filter.async).to.equal(true);
    expect(typeof filter.filter).to.equal('function');
  });

  describe('.filter()', function () {
    it('highlights strings', function (done) {
      const filter = factory();
      filter.filter('<div>test</div>', function (err, result) {
        expect(isHighlighted(result)).to.equal(true);
        expect(err).to.equal(null);
        done();
      });
    });

    it('highlights the contents of Vinyl files', function (done) {
      const filter = factory();
      const file = new Vinyl({
        contents: Buffer.from('<div>test</div>')
      });
      filter.filter(file, function (vinylErr, vinylResult) {
        expect(vinylErr).to.equal(null);
        expect(isHighlighted(vinylResult)).to.equal(true);

        filter.filter(file.contents.toString(), function (stringErr, stringResult) {
          expect(stringErr).to.equal(null);
          expect(vinylResult).to.equal(stringResult);
          done();
        });
      });
    });

    it('can be passed a Promise that resolved to a highlightable entity', function (done) {
      const filter = factory();
      filter.filter(Promise.resolve('<div>test</div>'), function (err, result) {
        expect(isHighlighted(result)).to.equal(true);
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

    it('accepts an optional language parameter', function (done) {
      const filter = factory();
      const str = '<div>test</div>';
      const highlightSpy = sinon.spy(highlight, 'highlight');
      const highlightAutoSpy = sinon.spy(highlight, 'highlightAuto');
      filter.filter(str, 'html', function (err, result) {
        expect(highlightSpy.calledWith('html', str)).to.equal(true);
        expect(highlightAutoSpy.called).to.equal(false);

        highlightSpy.reset();
        highlightAutoSpy.reset();

        filter.filter(str, function (err, result) {
          expect(highlightSpy.called).to.equal(false);
          expect(highlightAutoSpy.calledWith(str)).to.equal(true);
          done();
        });
      });
    });
  });
});

function isHighlighted(str) {
  return /<code class="hljs/.test(str);
}
