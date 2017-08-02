const {expect, sinon} = require('../../../../test/helpers');
const utils = require('./utils');

const formatSpy = sinon.spy(utils, 'format');
const consoleSpy = sinon.spy(console, 'log');

const log = require('./log');

describe('log', function () {
  beforeEach(function () {
    formatSpy.reset();
    consoleSpy.reset();
  });

  describe('default export', function () {
    it('outputs to the console', function () {
      const input = 'foo';
      log(input);
      expect(console.log.calledOnce).to.equal(true);
      expect(console.log.calledWith(input)).to.equal(true);
    });

    it('runs the input through the `format` utility', function () {
      const args = ['foo', {}];
      log(...args);
      expect(utils.format.calledOnce).to.equal(true);
      expect(utils.format.calledWith(...args)).to.equal(true);
    });
  });

  describe('.write()', function () {
    it('is the same function as the default export', function () {
      expect(log.write).to.equal(log);
    });
  });

  describe('.success()', function () {
    it('outputs to the console', function () {
      log.success('This is a success message');
      expect(console.log.calledOnce).to.equal(true);
    });
  });

  describe('.error()', function () {
    it('outputs to the console', function () {
      log.error(new Error('This is an error message'));
      expect(console.log.calledOnce).to.equal(true);
    });
  });

  describe('.warning()', function () {
    it('outputs to the console', function () {
      log.warning('This is a warning message');
      expect(console.log.calledOnce).to.equal(true);
    });
  });
});
