const {join} = require('path');
const {Entity, File} = require('@frctl/support');
const schema = require('./page.schema');

class Page extends Entity {

  toFile(opts = {}) {
    return new File({
      path: join(opts.base || '', this.get('permalink')),
      base: opts.base,
      contents: this.get('contents')
    });
  }

  static isPage(item) {
    return item instanceof Page;
  }

  get [Symbol.toStringTag]() {
    return 'Page';
  }

}

Page.schema = schema;

module.exports = Page;
