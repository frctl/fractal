module.exports = function(opts = {}) {

  return {

    name: 'funjucks',

    match: '.fjk',

    render(str, context, opts = {}, collections, app) {
      return Promise.resolve(str);
    },

  }

};
