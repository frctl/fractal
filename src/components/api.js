const _ = require('lodash');
const ApiBuilder = require('@frctl/internals/api');
const reqAll = require('req-all');

const methods = reqAll('./methods');

module.exports = function (fractal) {
  const api = new ApiBuilder();

  for (let methodFactory of _.values(methods)) {
    const method = methodFactory(fractal);
    api.addMethod(method.name, method.handler);
  }

  return api;
};
