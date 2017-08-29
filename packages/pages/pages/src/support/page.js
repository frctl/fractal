const {Entity, Validator} = require('@frctl/support');
const schema = require('./page.schema');

class Page extends Entity {

  constructor(props) {
    Validator.assertValid(props, schema, 'Page.constructor - invalid property schema [properties-invalid]');
    super(props);
  }

}

module.exports = Page;
