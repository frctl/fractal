const {expect, sinon, mockRequire} = require('../../../../test/helpers');

const stripSpy = sinon.spy(v => v);
const indentSpy = sinon.spy(v => v);

mockRequire('strip-indent', stripSpy);
mockRequire('indent-string', indentSpy);

const utils = mockRequire.reRequire('./utils');

describe('console utils', function () {
  beforeEach(function () {
    stripSpy.reset();
    indentSpy.reset();
  });

  describe('.parseError()', function () {
    it('returns an object with message and stack properties', function () {
      const result = utils.parseError(new Error('foobar'));
      expect(result).to.have.property('message');
      expect(result).to.have.property('stack');
      expect(result.message).to.be.a('string');
      expect(result.stack).to.be.a('string');
    });

    it('has a null stack property if the input is not an Error instance', function () {
      const result = utils.parseError('foobar');
      expect(result.message).to.equal('foobar');
      expect(result.stack).to.equal(null);
    });
  });

  describe('.indent()', function () {
    it('calls indentString', function () {
      utils.indent('foo');
      expect(indentSpy.calledOnce).to.be.equal(true);
    });
  });

  describe('.reIndent()', function () {
    it('strips and re-indents a string', function () {
      utils.reIndent('foo');
      expect(stripSpy.calledOnce).to.be.equal(true);
      expect(indentSpy.calledOnce).to.be.equal(true);
    });
  });

  describe('.unIndent()', function () {
    it('strips indentation from a string', function () {
      utils.unIndent('foo');
      expect(stripSpy.calledOnce).to.be.equal(true);
    });
  });
});
