const _ = require('lodash');
const reqAll = require('req-all');
const Api = require('@frctl/core').Api;

const bundledMethods = reqAll('./methods');

module.exports = function(){

  const api = new Api();
  for (const method of _.values(bundledMethods)) {
    api.addMethod(method.name, method.handler);
  }

  return api;

};
