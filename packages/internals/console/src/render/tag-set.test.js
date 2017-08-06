const {expect} = require('../../../../../test/helpers');
const Tag = require('./tag');
const TagSet = require('./tag-set');

const tags = {
  em: {
    display: 'inline'
  }
};

describe('TagSet', () => {
  describe('constructor', () => {
    it('instantiates an array of tags from config', () => {
      const set = new TagSet(tags);
      expect(set.tags.length).to.equal(1);
    });
  });

  describe('.tags', () => {
    it('returns an array of tags', () => {
      const set = new TagSet(tags);
      expect(set.tags).to.be.an('array');
      for (const tag of set.tags) {
        expect(tag).to.be.instanceOf(Tag);
      }
    });
  });

  describe('.get()', () => {
    it('finds an tag by name', () => {
      const set = new TagSet(tags);
      expect(set.get('em')).to.be.instanceOf(Tag);
      expect(set.get('em').name).to.equal('em');
    });

    it('returns undefined if no matching tag is found', () => {
      const set = new TagSet(tags);
      expect(set.get('foo')).to.equal(undefined);
    });
  });
});
