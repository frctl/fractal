const _ = require('lodash');
const reqAll = require('req-all');
const Api = require('@frctl/internals').Api;

const bundledMethods = reqAll('./methods');

module.exports = function (fractal) {
  const api = new Api();

  api.addProperty('components', function () {
    return this.$data.components;
  });

  api.addProperty('collections', function () {
    return this.$data.collections;
  });

  api.addProperty('files', function () {
    return this.$data.files;
  });

  for (const methodFactory of _.values(bundledMethods)) {
    const method = methodFactory(fractal);
    api.addMethod(method.name, method.handler);
  }

  return api;
};
