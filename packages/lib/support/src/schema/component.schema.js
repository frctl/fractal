const fileSchema = require('./file.schema');
const fileCollectionSchema = require('./file-collection.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  definitions: {
    file: fileSchema,
  },
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    src: {
      anyOf: [{
        instanceof: 'File'
      }, {
        $ref: '#/definitions/file'
      }]
    },
    config: {
      type: 'object',
      // TODO: config object schema
    },
    files: {
      anyOf: [{
        instanceof: 'FileCollection'
      }, {
        type: 'array'
      }]
    },
    variants: {
      anyOf: [{
        instanceof: 'VariantCollection'
      }, {
        type: 'array'
      }]
    },
    scenarios: {
      anyOf: [{
        instanceof: 'EntityCollection'
      }, {
        type: 'array'
      }]
    }
  },
  required: ['id', 'src']
};
