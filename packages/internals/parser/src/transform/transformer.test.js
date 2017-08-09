/* eslint handle-callback-err: off, no-unused-expressions: off */
const {Emitter} = require('@frctl/support');
const {expect} = require('../../../../../test/helpers');
const makePlugin = require('../../test/helpers').makePlugin;
const Transformer = require('./transformer');

const validTransform = {
  name: 'valid-tranform',
  passthru: true,
  transform: i => i
};
const validTransformWithPlugin = {
  name: 'valid-tranform',
  passthru: true,
  transform: i => i,
  plugins: makePlugin('test-plugin')
};
const transformWithInvalidPlugin = {
  name: 'valid-tranform',
  passthru: true,
  transform: i => i,
  plugins: {handler: i => i}
};
const validTransformWithPlugins = {
  name: 'valid-tranform',
  passthru: true,
  transform: i => i,
  plugins: [
    makePlugin('test-plugin-1'),
    makePlugin('test-plugin-2', 'components'),
    makePlugin('test-plugin-3')
  ]
};

describe('Transformer', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const transformer = new Transformer(validTransform);
      expect(transformer instanceof Transformer).to.be.true;
      expect(transformer instanceof Emitter).to.be.true;
    });
    it('validates its input', function () {
      expect(() => new Transformer(/* Empty */)).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer('Invalid string')).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer({name: 'transform without required props'})).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer(transformWithInvalidPlugin)).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer(validTransform)).to.not.throw();
      expect(() => new Transformer(validTransformWithPlugin)).to.not.throw();
      expect(() => new Transformer(validTransformWithPlugins)).to.not.throw();
    });
    it('assigns items passed to constructor correctly');
  });
});
