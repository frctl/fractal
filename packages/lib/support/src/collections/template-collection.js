const Template = require('../entities/template');
const FileCollection = require('./file-collection');

class TemplateCollection extends FileCollection {

  get [Symbol.toStringTag]() {
    return 'TemplateCollection';
  }

}

TemplateCollection.entity = Template;

module.exports = TemplateCollection;
