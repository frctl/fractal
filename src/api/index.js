const _ = require('lodash');
const reqAll = require('req-all');
const Api = require('@frctl/internals').Api;

const bundledMethods = reqAll('./methods');

module.exports = function(){

  const api = new Api();

  api.addProperty('components', function(){
    return this.$data.components;
  });

  api.addProperty('collections', function(){
    return this.$data.collections;
  });

  api.addProperty('files', function(){
    return this.$data.files;
  });

  for (const method of _.values(bundledMethods)) {
    api.addMethod(method.name, method.handler);
  }

  return api;

};
