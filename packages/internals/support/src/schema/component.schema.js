const fileSchema = require('./file.schema');
const fileCollectionSchema = require('./file-collection.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  definitions: {
    file: fileSchema,
    fileCollection: fileCollectionSchema
  },
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    path: {
      type: 'string'
    },
    base: {
      type: 'string'
    },
    config: {
      type: 'object'
    },
    files: {
      oneOf: [{
        $ref: '#/definitions/fileCollection'
      }, {
        type: 'array'
      }]
    }
  },
  required: ['path']
};
