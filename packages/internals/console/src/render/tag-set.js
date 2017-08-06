const {mapValues} = require('lodash');
const {defaultsDeep} = require('@frctl/utils');
const config = require('./config');
const Tag = require('./tag');

const _tags = new WeakMap();

class TagSet {

  constructor(custom = {}) {
    const tags = defaultsDeep(custom, config.tags);
    _tags.set(this, mapValues(tags, (tag, name) => new Tag(name, tag)));
  }

  get(name) {
    if (!this.tags[name]) {
      throw new Error(`Unknown tag name '${name}'`);
    }
    return this.tags[name];
  }

  get tags() {
    return _tags.get(this);
  }

}

module.exports = TagSet;
