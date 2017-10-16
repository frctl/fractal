const {join} = require('path');
const {Entity, Validator, File} = require('@frctl/support');
const schema = require('./page.schema');

class Page extends Entity {

  constructor(props) {
    Validator.assertValid(props, schema, 'Page.constructor - invalid property schema [properties-invalid]');
    super(props);
  }

  toFile(opts = {}) {
    return new File({
      path: join(opts.base || '', this.get('permalink')),
      base: opts.base,
      contents: this.get('contents'),
    });
  }

  static isPage(item) {
    return item instanceof Page;
  }

  get [Symbol.toStringTag]() {
    return 'Page';
  }

}

module.exports = Page;
