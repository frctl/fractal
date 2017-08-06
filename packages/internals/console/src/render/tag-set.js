const {map} = require('lodash');
const Tag = require('./tag');

const _tags = new WeakMap();

class TagSet {

  constructor(tags = {}) {
    _tags.set(this, map(tags, (tag, name) => new Tag(name, tag)));
  }

  get(name) {
    return this.tags.find(tag => tag.name === name);
  }

  get tags() {
    return _tags.get(this);
  }

}

module.exports = TagSet;
