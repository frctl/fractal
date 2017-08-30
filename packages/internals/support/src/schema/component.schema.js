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
    src: {
      $ref: '#/definitions/file'
    },
    config: {
      type: 'object'
    },
    files: {
      oneOf: [{
        $ref: '#/definitions/fileCollection'
      }, {
        type: 'null'
      }]
    }
  },
  required: ['src']
};
