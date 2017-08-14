module.exports = {
  properties: {
    name: {
      type: 'string'
    },
    collection: {
      type: 'string'
    },
    handler: {
      typeof: 'function'
    }
  },
  required: ['name', 'handler']
}
