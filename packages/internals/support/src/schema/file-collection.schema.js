const fileSchema = require('./file.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  definitions: {
    file: fileSchema
  },
  type: 'object',
  properties: {
    length: {
      type: 'number'
    },
    items: {
      type: 'array',
      items: {
        $ref: '#/definitions/file'
      }
    }
  }
};
