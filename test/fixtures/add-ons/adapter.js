module.exports = function(opts = {}){

    return {

      name: 'funjucks',

      match: '.fjk',

      render(file, context, opts = {}, collections, app){
        return Promise.resolve('rendered!');
      }

    }

};
