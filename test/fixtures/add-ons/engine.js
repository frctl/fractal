module.exports = function(opts = {}){

    return {

      name: 'funjucks',

      match: '.fjk',

      render(tpl, context, opts = {}, collections, app){
        return Promise.resolve(tpl.stringify());
      },

    }

};
