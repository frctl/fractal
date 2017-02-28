const _ = require('lodash');
const api = require('@frctl/internals/api');
const reqAll = require('req-all');

const methods = reqAll('./methods');

module.exports = function(fractal){

    const filesApi = api();

    for (let methodFactory of _.values(methods)) {
      const method = methodFactory(fractal);
      filesApi.addMethod(method.name, method.handler);
    }

    return filesApi;

};
