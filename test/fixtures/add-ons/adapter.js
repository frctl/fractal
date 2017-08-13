module.exports = function(opts = {}){

    return {

      name: 'funjucks',

      match: '.fjk',

      render(file, context, opts = {}, {components}, app){
        return Promise.resolve('rendered!');
      }

    }

};
