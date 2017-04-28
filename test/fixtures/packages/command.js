module.exports = function(opts = {}){

  return {

    command: 'dothis <thing>',

    description: 'Does the thing',

    handler(argv, {components, files}, app, env) {
      //...
    }

  }

};
