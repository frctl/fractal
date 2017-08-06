const {expect, sinon, mockRequire} = require('../../../../test/helpers');
const logger = require('./log');

const consoleSpy = sinon.spy(console, 'log');
const renderSpy = sinon.spy(v => v);

describe('logger', function () {
  beforeEach(function () {
    renderSpy.reset();
    consoleSpy.reset();
  });

  describe('.log()', function () {
    it('outputs to the console', function () {
      const input = 'foo';
      logger.log(input);
      expect(console.log.calledOnce).to.equal(true);
    });

    it('renders the input', function () {
      mockRequire('./utils', {
        render: renderSpy
      });
      const logger = mockRequire.reRequire('./log');
      logger.log('foo');
      expect(renderSpy.called).to.equal(true);
      mockRequire.stop('./utils');
    });
  });

  describe('.success()', function () {
    it('outputs to the console', function () {
      logger.success('This is a success message');
      expect(consoleSpy.calledOnce).to.equal(true);
      expect(consoleSpy.args[0][0].indexOf('This is a success message')).to.be.above(-1);
    });

    it('accepts an optional second argument for an extended description', function () {
      logger.success('main', 'secondary');
      expect(consoleSpy.args[0][0].indexOf('secondary')).to.be.above(-1);
      consoleSpy.reset();
    });
  });

  describe('.error()', function () {
    it('outputs to the console', function () {
      logger.error(new Error('This is an error message'));
      expect(consoleSpy.calledOnce).to.equal(true);
      expect(consoleSpy.args[0][0].indexOf('This is an error message')).to.be.above(-1);
    });

    it('includes stack in error if opts.stack is not false', function () {
      const error = new Error('This is an error message');
      logger.error(error);
      expect(consoleSpy.args[0][0].indexOf('at Context.')).to.be.above(-1);
      consoleSpy.reset();
      logger.error(error, false);
      expect(consoleSpy.args[0][0].indexOf('at Context.')).to.equal(-1);
    });
  });

  describe('.warning()', function () {
    it('outputs to the console', function () {
      logger.warning('This is a warning message');
      expect(consoleSpy.calledOnce).to.equal(true);
      expect(consoleSpy.args[0][0].indexOf('This is a warning message')).to.be.above(-1);
    });

    it('accepts an optional second argument for an extended description', function () {
      logger.warning('main', 'secondary');
      expect(consoleSpy.args[0][0].indexOf('secondary')).to.be.above(-1);
      consoleSpy.reset();
    });
  });
});
