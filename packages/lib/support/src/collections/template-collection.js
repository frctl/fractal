const Template = require('../entities/template');
const EntityCollection = require('./entity-collection');

class TemplateCollection extends EntityCollection {

  get [Symbol.toStringTag]() {
    return 'TemplateCollection';
  }

}

TemplateCollection.entity = Template;

module.exports = TemplateCollection;
