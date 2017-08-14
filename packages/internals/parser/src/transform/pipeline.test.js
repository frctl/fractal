/* eslint handle-callback-err: off, no-unused-expressions: off */

// const {Emitter} = require('@frctl/support');
const {expect} = require('../../../../../test/helpers');
const Pipeline = require('./pipeline');

describe('Pipeline', function () {
  describe('constructor', function () {
    it('returns a new instance if correct properties provided', function () {
      const pipeline = new Pipeline();
      expect(pipeline instanceof Pipeline).to.be.true;
    });
  });
  describe('.transforms', function () {
    it(`has a 'transforms' getter`, function () {
      const pipeline = new Pipeline();
      expect(pipeline.transforms).to.eql([]);
    });
  });
});
