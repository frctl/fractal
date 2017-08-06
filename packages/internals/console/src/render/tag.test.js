const {expect} = require('../../../../../test/helpers');
const Tag = require('./tag');

const styleProps = {
  color: 'red',
  bgColor: 'green',
  style: 'bold'
};

describe('Tag', () => {
  describe('constructor', () => {
    it('sets a name property from the first argument', () => {
      const tag = new Tag('foo');
      expect(tag.name).to.equal('foo');
    });

    it('sets the configuration values', () => {
      const config = {open: 'bar'};
      const tag = new Tag('foo', config);
      expect(tag.config).to.equal(config);
    });
  });

  describe('.close()', () => {
    it('returns a string with the a closing brace for each style config prop', () => {
      const tag = new Tag('foo', styleProps);
      expect(tag.close()).to.equal('}}}');
    });
  });

  describe('.open()', () => {
    it('returns a string', () => {
      const tag = new Tag('foo');
      expect(tag.open()).to.be.a('string');
    });
    it('appends chalk-style formatting open tags for each style config prop', () => {
      const tag = new Tag('foo', styleProps);
      const result = tag.open();
      expect(result.indexOf(`{red `)).to.be.above(-1);
      expect(result.indexOf(`{bgGreen `)).to.be.above(-1);
      expect(result.indexOf(`{bold `)).to.be.above(-1);
    });
  });

  describe('.display', () => {
    it('returns the display value set in the config', () => {
      const tag = new Tag('bar', {display: 'block'});
      expect(tag.display).to.equal('block');
    });
    it('defaults to `inline` if not set in config', () => {
      const tag = new Tag('bar');
      expect(tag.display).to.equal('inline');
    });
  });

  describe('.preformatted', () => {
    it('returns the preformatted value set in the config', () => {
      const tag = new Tag('bar', {preformatted: true});
      expect(tag.preformatted).to.equal(true);
    });
    it('defaults to false if not set in config', () => {
      const tag = new Tag('bar');
      expect(tag.preformatted).to.equal(false);
    });
  });

  describe('.config', () => {
    it('returns the configuration object', () => {
      const tag = new Tag('foo');
      expect(tag.config).to.be.an('object');
      const tag2 = new Tag('bar', {test: 'foo'});
      expect(tag2.config).to.be.an('object');
    });
  });
});
